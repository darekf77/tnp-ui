import { Component, OnInit, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { Morphi, ModelDataConfig } from 'morphi';

import { Log, Level } from 'ng2-logger';
import { Helpers } from 'morphi';
import { Router } from '@angular/router';
import { CLASS } from 'typescript-class-helpers';

const log = Log.create('Table wrapper');


@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss']
})
export class TableWrapperComponent implements OnInit {

  @Input() arrayDataConfig = new Morphi.CRUD.ModelDataConfig();

  @Input() rowHref: string;

  @Input() allowedColumns: string[] = [];
  @Input() crud: Morphi.CRUD.Base<any>;

  public messages = {
    emptyMessage: undefined,
    totalMessage: undefined
  };

  @Input() rows = _.times(50, (id) => {
    return {
      id,
      name: `Amazing ${id} row `
    };
  });


  @Input() columns = [
    {
      prop: 'id'
    },
    {
      prop: 'name'
    }
  ];

  constructor() { }

  async setSorting(e: {}) {
    log.i('sorting', e);
  }


  async setPage(e: { count: number, pageSize: number, limit: number, offset: number }) {
    this.arrayDataConfig.set.pagination.pageNumber(e.offset + 1);
    await this.retriveData();
  }

  async ngOnInit() {
    this.arrayDataConfig.set.pagination.rowDisplayed(5);
    log.i('arrayDataConfig', this.arrayDataConfig);
    log.i('this.crud.entity', CLASS.describeProperites(this.crud.entity));

    try {
      const columns = CLASS.describeProperites(this.crud.entity)
        .filter(prop => this.allowedColumns.length > 0 ? this.allowedColumns.includes(prop) : true)
        .map(prop => {
          return { prop };
        });
      this.columns = columns;
      log.i('columns', columns);
      await this.retriveData();

    } catch (error) {

    }
  }
  async retriveData() {
    const rows = await this.crud.getAll(this.arrayDataConfig).received.observable.take(1).toPromise();
    const totalElements = Number(rows.headers.get(Morphi.SYMBOL.X_TOTAL_COUNT));
    if (!isNaN(totalElements)) {
      this.arrayDataConfig.set.pagination.totalElement(totalElements);
    }
    log.i(Morphi.SYMBOL.X_TOTAL_COUNT, rows.headers.get(Morphi.SYMBOL.X_TOTAL_COUNT));
    log.i('rows', rows.body.json);
    this.rows = rows.body.json;
  }

  onTableContextMenu(e) {
    // if (this.rowHref) {
    //   this.router.navigateByUrl(this.rowHref)
    // }
    log.i('context menu event', e);
  }

}
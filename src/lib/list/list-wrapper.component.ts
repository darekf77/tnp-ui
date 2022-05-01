import { Component, OnInit, Input, Output, ViewChild, TemplateRef } from '@angular/core';
import { times } from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Morphi } from 'morphi';
import { Log, Level } from 'ng2-logger';
// @LAST prolem here
import { interpolateParamsToUrl } from 'ng2-rest';
import { Router } from '@angular/router';
import { isString } from 'lodash';

import { BaseFormlyComponent, DualComponentController } from 'tnp-helpers';
import { CLASS } from 'typescript-class-helpers';
import * as _ from 'lodash';

const log = Log.create('List wrapper components', Level.__NOTHING);

export interface CRUDListWrapperLink {
  href?: string;
  action?: (data: CRUDListWrapperLink) => void;
  name: string;
  id?: any;
  data?: any;
  lock?: boolean;
}

export class DualComponentControllerExtendedForListWrapper extends DualComponentController {

  get data(): CRUDListWrapperLink[] {
    return this.getValTemplateOptions('data')
  }

  get linkSchema(): string {
    return this.getValTemplateOptions('linkSchema')
  }

  get linkProp(): string {
    return this.getValTemplateOptions('linkProp')
  }

  get nameProp(): string {
    return this.getValTemplateOptions('nameProp')
  }

  get lockProp(): string {
    return this.getValTemplateOptions('lockProp')
  }

  get icon(): string {
    return this.getValTemplateOptions('icon')
  }

  get allowedColumns(): string {
    return this.getValTemplateOptions('allowedColumns')
  }

}

@CLASS.NAME('ListWrapperComponent')
@Component({
  selector: 'app-list-wrapper',
  templateUrl: './list-wrapper.component.html',
  styleUrls: ['./list-wrapper.component.scss']
})
export class ListWrapperComponent
  extends BaseFormlyComponent<DualComponentControllerExtendedForListWrapper> implements OnInit {
  entity: any;
  DualComponentController = DualComponentControllerExtendedForListWrapper;
  constructor(
    private router: Router,
    private dialogService: MatDialog
  ) {
    super();
  }
  isLoading = false;
  @Input() icon = 'info';

  @Input() data: CRUDListWrapperLink[] = [
    { href: 'http://onet.pl', name: 'Onet' },
    { href: 'http://google.pl', name: 'Google' }
  ];
  @Input() linkProp = 'href';
  @Input() linkSchema = 'example/:id';
  @Input() nameProp = 'name';
  @Input() lockProp = '';
  @Input() allowedColumns: string[] = [];

  @Input() arrayDataConfig = {};

  @ViewChild('create') templateCreate: TemplateRef<any>;
  @Input() crud: Morphi.CRUD.Base<any>;


  columns = [
    {
      prop: 'id'
    },
    {
      prop: 'name'
    }
  ];

  dialogRef: MatDialogRef<any>;


  async ngOnInit() {
    await super.ngOnInit()
    log.i(`this.data`, this.data);
    log.i(`CRUD`, this.crud);
    log.i(`CRUD ENTITY`, this.crud && this.crud.entity);
    if (this.lockProp) {
      this.icon = 'lock';
    }

    if (this.crud && this.crud.entity) {
      const columns = CLASS.describeProperites(this.crud && this.crud.entity)
        .filter(prop => this.allowedColumns.length > 0 ? this.allowedColumns.includes(prop) : true)
        .map(prop => {
          return { prop };
        });
      this.columns = columns;
      log.i('columns', columns);
    }

    if (this.crud) {
      // await this.retriveData();
    }
    // else {
    //   this.initLinks(this.ctrl.data);
    // }

  }

  open(d: CRUDListWrapperLink) {
    console.log('OPEN', d)
    if (_.isFunction(d.action)) {
      d.action(d);
      return;
    }
    const link = d.href;
    log.i(`open link: ${link}`);
    if (link && isString(link) && link.trim() !== '') {
      this.router.navigateByUrl(link);
    }
  }

  complete(model) {
    log.i('COMPLETE')
    this.ctrl.data.push(model);
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }



  // async retriveData() {
  //   this.isLoading = true;
  //   log.i('this.crud.entity',CLASS.describeProperites(this.crud.entity));
  //   try {
  //     log.i('this.arrayDataConfig', this.arrayDataConfig);
  //     const rows = await this.crud.getAll(this.arrayDataConfig).received;
  //     const totalElements = Number(rows.headers.get(Morphi.SYMBOL.X_TOTAL_COUNT));
  //     this.isLoading = false;
  //     if (!isNaN(totalElements)) {
  //       this.arrayDataConfig.set.pagination.totalElement(totalElements);
  //     }
  //     this.data = rows.body.json;
  //     log.i('init link with ', this.data);
  //     this.initLinks(this.data);
  //   } catch (error) {
  //     this.isLoading = false;
  //   }
  // }

  get links(): CRUDListWrapperLink[] {
    if (!(this.ctrl && this.ctrl.data)) {
      return [];
    }
    // log.d('init links this.linkSchema', this.linkSchema);
    const links = this.ctrl.data.map(row => {
      if (this.linkSchema) {
        // log.d('interpolated link row', row);
        const href = interpolateParamsToUrl(row, this.linkSchema);
        // log.d('interpolated link', href);
        // log.d('row', row)
        // log.d('this.linkProp', this.linkProp)
        // log.d('this.nameProp', this.nameProp)
        const res = { href, name: row[this.nameProp], lock: row[this.lockProp], action: row.action };
        // log.d('res', res);
        return res;
      }
      // log.d('row', row)
      // log.d('this.linkProp', this.linkProp)
      // log.d('this.nameProp', this.nameProp)
      return { href: row[this.linkProp], name: row[this.nameProp], action: row.action };
    });
    // log.i('links', links);
    return links;
  }


  createDialog() {
    // this.model = {};
    this.dialogRef = this.dialogService.open(this.templateCreate);
  }

}

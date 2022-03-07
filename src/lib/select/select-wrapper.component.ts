// angular
import {
  Component, OnInit, Input, Output, AfterViewInit, forwardRef,
} from '@angular/core';
import * as _ from 'lodash';
import { Morphi } from 'morphi';
import { Log, Level } from 'ng2-logger';
import { BaseFormlyComponent, DualComponentController } from 'tnp-helpers';
import { CLASS } from 'typescript-class-helpers';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { firstValueFrom } from 'rxjs';


export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectWrapperComponent),
  multi: true
};


const log = Log.create('select wrapper');

export interface CRUDSelectWrapperOption {
  value: string;
  label: string;
}

@CLASS.NAME('SelectWrapperComponent')
@Component({
  selector: 'app-select-wrapper',
  templateUrl: './select-wrapper.component.html',
  styleUrls: ['./select-wrapper.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SelectWrapperComponent extends BaseFormlyComponent implements OnInit, AfterViewInit {

  isLoading = false;

  @Input() crud: Morphi.CRUD.Base<any>;

  @Input() selectOptions: CRUDSelectWrapperOption[] = [];


  @Input() data = [
    { value: 'dupa', label: 'Onet' },
    { value: 2, label: 'Google' }
  ];

  @Input() label = 'default label'

  @Input() valueProp = 'id';
  @Input() nameProp = 'name';


  // fields: FormlyFieldConfig[] = [];

  // @Input() lable: string;

  /*
  // TOOD  errir ub oridyctuib TS2416:
Property 'field' in type 'SelectWrapperComponent' is not assignable to the
same property in base type 'BaseFormlyComponent<DualComponentController<any>>'.
  Type 'import('/Users/dfilipiak/projects/npm/tnp-ui/node_modules/@ngx-formly
  /core/lib/components/formly.field.config").FormlyFieldConfig'
   is not assignable to type 'import('/Users/dfilipiak/projects/npm/tnp-helpers
   /node_modules/@ngx-formly/core/lib/components/formly.field.config").FormlyFieldConf
  */
  public field: FormlyFieldConfig | any;
  async ngOnInit() {

    super.ngOnInit()

    if (!this.crud && _.isFunction(_.get(this.field, 'templateOptions.crud'))) {
      this.crud = this.field.templateOptions.crud;
    }

    if (_.isFunction(this.crud)) {
      this.isLoading = true;
      log.i('this.crud.entity', CLASS.describeProperites(this.crud.entity));
      try {
        const rows = await firstValueFrom(this.crud.getAll().received.observable);
        this.initOptions(rows.body.json);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    } else {
      this.initOptions(this.data);
    }

  }

  initOptions(rows: any[]) {
    this.selectOptions = rows.map(r => {
      if (!this.crud) {
        return r;
      }
      return { value: r[this.valueProp], label: r[this.nameProp] };
    });
  }

  ngAfterViewInit() {
    // log.i('this', this.field);
  }

}

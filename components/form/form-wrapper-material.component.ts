import * as _ from 'lodash';
// angular
import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild,
  TemplateRef, ComponentFactoryResolver, ViewContainerRef,
  AfterViewInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
// material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// formly
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
// other
import { Morphi, ModelDataConfig } from 'morphi';
import { Log, Level } from 'ng2-logger';
import { CLASS } from 'typescript-class-helpers';
const log = Log.create('form warpper material component');

@Component({
  selector: 'app-form-wrapper-material',
  templateUrl: './form-wrapper-material.component.html',
  styleUrls: ['./form-wrapper-material.component.scss']
})
export class FormWrapperMaterialComponent implements OnInit, AfterViewInit {

  @Input() modelDataConfig = new Morphi.CRUD.ModelDataConfig();
  @ViewChild('templateDelete') templateDelete: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private resolver: ComponentFactoryResolver
  ) { }

  formly = {
    form: (undefined) as FormGroup,
    options: undefined as FormlyFormOptions,
    fields: undefined as FormlyFieldConfig[]
  };

  id_toDelete: number;
  public get hasRegisteredCmp() {
    return !!this.ftype;
  }
  public ftype: { component: Function; entity?: Function; name: string };
  @Input() id: number;
  @ViewChild('entitycomponent', { read: ViewContainerRef }) entitycomponent: ViewContainerRef;

  /**
   * Exclude or Include specyfic generated form fields
   */
  @Input() exclude: string[];
  @Input() include: string[];

  @Input() fieldsOrder: string[];

  @Input() mode: 'update' | 'create' = 'update';

  @Input() crud: Morphi.CRUD.Base<any>;

  @Input() form = new FormGroup({});
  @Input() formGroup: FormGroup;
  @Input() model = {};
  @Input() showButtons = true;
  @Input() options: FormlyFormOptions = {};
  @Input() fields: FormlyFieldConfig[] = [];

  private backupModel = {};

  @Output() submit = new EventEmitter();

  @Output() complete = new EventEmitter();

  @Input() entity: Function;

  dialogRefDelete: MatDialogRef<any>;


  async ngOnInit() {
    log.i('[formwarpper] this.fields before anyting from input', this.fields)

    // console.log('model', this.model);
    // log.i(`CRUD`, this.crud);
    if (!this.entity && this.crud && this.crud.entity) {
      this.entity = this.crud.entity;
    }
    if (!this.entity && _.isObject(this.model)) {
      const ob = _.isArray(this.model) ? _.first(this.model) : this.model;
      this.entity = CLASS.getFromObject(ob)
    }
    log.i('[formwarpper] this.fields before resolve from input', this.fields)
    this.resolveFields();

    this.formly.options = this.options;
    this.formly.form = this.formGroup ? this.formGroup : this.form;
    this.setModel(this.model);


    if ((!_.isUndefined(this.id))) {
      const m = await this.crud.getBy(this.id, this.modelDataConfig).received;
      this.setModel(m.body.json);
    }

    this.createOrder();
    log.i('result formly', this.formly);
  }

  waringAboutDecorator() {
    console.error(`

    Please use:
    @Morphi.Entity(...)

    decorator for entity "${this.entity && _.trim(this.entity.name)}"

    `);
  }

  resolveFields() {
    let fieldsFromEntity = _.isFunction(this.entity) ? Morphi.Formly.getFrom(this.entity) : [];
    log.i(`fields from entity : ${this.entity && this.entity.name}`, fieldsFromEntity);

    if (_.isFunction(this.entity) && !fieldsFromEntity) {
      this.waringAboutDecorator();
    }

    if (_.isArray(this.fields)) {
      log.i('field from input', this.fields);

      if (_.isArray(fieldsFromEntity)) {
        const keys = fieldsFromEntity.map(c => c.key);

        fieldsFromEntity = fieldsFromEntity.map(field => {
          return _.merge(field, this.fields.find(f => f.key === field.key));
        });
        fieldsFromEntity = fieldsFromEntity
          .concat(this.fields.filter(field => !keys.includes(field.key)) as any);
        // log.i('field affer contact', fields);
      }

    }
    if (!_.isArray(fieldsFromEntity)) {
      fieldsFromEntity = this.fields as any;
    }

    fieldsFromEntity = fieldsFromEntity.filter(({ key }) => {
      if (_.isArray(this.exclude)) {
        return !(key && this.exclude.includes(key as any));
      }
      if (_.isArray(this.include)) {
        return (key && this.include.includes(key as any));
      }
      return true;
    });
    // log.i('fields filter', fields);

    this.formly.fields = fieldsFromEntity as any;
    // log.i('FORMLY FIELDS', this.formly.fields);
  }


  ngAfterViewInit() {
    if (this.hasRegisteredCmp) {
      setTimeout(() => {
        this.entitycomponent.clear();
        const factory = this.resolver.resolveComponentFactory(this.ftype.component as any);
        const componentRef = this.entitycomponent.createComponent(factory);
        (componentRef.instance as any).model = this.model;
      });
    }

  }



  createOrder() {

    if (!this.fieldsOrder) {
      this.fieldsOrder = [];
    }
    if (_.isString(this.fieldsOrder)) {
      this.fieldsOrder = this.fieldsOrder.split(',');
    }
    // log.i('create order!', this.fieldsOrder);
    const fieldsNewOrder = [];

    if (this.fieldsOrder.length > 0) {
      this.fieldsOrder.forEach(orderKey => {
        const f = this.formly.fields.find(({ key, id }) => (key === orderKey || id === orderKey));
        if (f) {
          fieldsNewOrder.push(f);
        }
      });
      this.formly.fields = fieldsNewOrder.concat(this.formly.fields.filter(f => !fieldsNewOrder.includes(f)));
      // log.i('new Order', this.formly.fields.map(f => f.key).join(','));
    }
  }

  setModel(model) {
    this.model = model;
    this.backupModel = _.cloneDeep(this.model);
  }

  async ngSubmit(model) {

    const { id } = model;
    let resultModel = model;
    log.i('submit model', model);

    if (this.crud) {
      if (this.mode === 'update') {
        try {
          const m = await this.crud.updateById(id, model, this.modelDataConfig).received;
          log.i('Model update success', m);
          resultModel = m.body.json;
          this.submit.next(model);
        } catch (e) {
          log.er('Model update error', e);
          this.submit.error(e);
        }
      } else if (this.mode === 'create') {
        try {
          const m = await this.crud.create(model, this.modelDataConfig).received;
          log.i('Model create success', m);
          resultModel = m.body.json;
          this.submit.next(model);
        } catch (e) {
          log.er('Model create error', e);
          this.submit.error(e);
        }
      }

    } else if (this.crud) {
      this.submit.next(model);
    }
    this.complete.next(resultModel);
  }

  async delete(id) {
    await this.crud.deleteById(id).received;
  }
  openDeleteDialog(id) {
    log.i('openDeleteDialog to delete id: ', id);
    this.id_toDelete = id;
    this.dialogRefDelete = this.dialog.open(this.templateDelete);
    this.dialogRefDelete.afterClosed().subscribe((result) => {
      log.i(`dialog result: ${result} `);
      if (result) {
        this.complete.next();
      }
    });
  }

  onNoClick(): void {
    this.dialogRefDelete.close();
  }

  clear() {
    this.model = this.backupModel;
    this.backupModel = _.cloneDeep(this.model);
  }

}
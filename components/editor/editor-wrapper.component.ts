import { Component, OnInit, Input } from '@angular/core';
// formly
import { FieldType } from '@ngx-formly/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
// other
import * as _ from 'lodash';
import { Log, Level } from 'ng2-logger';
const log = Log.create('editor wrapper');
import { Morphi } from 'morphi';
import { CLASS } from 'typescript-class-helpers';
import { BaseFormlyComponent, DualComponentController } from 'tnp-helpers';

export class DualComponentControllerExtended extends DualComponentController {

  get buttons() {
    const res = this.getValTemplateOptions('buttons');
    return Array.isArray(res) ? res.toString() : ''
  }

}

export type OptionsButtons = 'bold' | 'italic' | 'underline';

@CLASS.NAME('EditorWrapperComponent')
@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.scss']
})
export class EditorWrapperComponent extends BaseFormlyComponent implements OnInit {

  DualComponentController = DualComponentControllerExtended;

  @Input() buttons: OptionsButtons[] = ['bold', 'italic', 'underline']

  contentChange(e) {
    setTimeout(() => {
      this.ctrl.value = e;
      // this.field.formControl.setValue(e)
    });
  }

  ngOnInit() {
    super.ngOnInit()
  }

}

import { Component, OnInit } from '@angular/core';
// formly
import { FieldType } from '@ngx-formly/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
// other
import * as _ from 'lodash';
import { Log, Level } from 'ng2-logger';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Morphi } from 'morphi';
import { CLASS } from 'typescript-class-helpers';
const log = Log.create('formly switch');

// @Morphi.Formly.RegisterComponentAsType('FormlySwitchComponent', 'switch')
@CLASS.NAME('FormlySwitchComponent')
@Component({
  selector: 'app-formly-switch',
  templateUrl: './formly-switch.component.html',
  styleUrls: ['./formly-switch.component.scss']
})
export class FormlySwitchComponent extends FieldType implements OnInit {



  change(e: MatSlideToggleChange) {
    this.formControl.setValue(e.checked);
  }

  ngOnInit() {
    if (_.isUndefined(this.field.defaultValue)) {
      this.field.defaultValue = false;
    }

    if (!this.field.templateOptions.label) {
      this.field.templateOptions.label = 'button with action';
    }
  }

}
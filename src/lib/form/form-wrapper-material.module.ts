// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// formly
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMatInputModule } from '@ngx-formly/material/input';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import { RepeatTypeComponent } from 'morphi';
import { FormlyHorizontalWrapper } from 'morphi';

// custom formly components
import { SelectWrapperModule, SelectWrapperComponent } from '../select';


// other
import { NgStringPipesModule } from 'ngx-pipes';
// local
import { FormWrapperMaterialComponent } from './form-wrapper-material.component';

// base components
import {
  EditorWrapperModule
} from '../editor';

// aditional types componets
import {
  IconButtonWithActionComponent
} from './additional-types';
import { FormlyButtionWithActionModule } from '../formly-buttion-with-action';
// import { ProcessLoggerModule } from '../entity-components/process-logger';

export const FormlyModuleMod = FormlyModule.forRoot({
  types: [
    // { name: 'switch', component: FormlySwitchComponent },
    { name: 'iconbutton', component: IconButtonWithActionComponent },
    { name: 'repeat', component: RepeatTypeComponent }
  ],
  validationMessages: [
    { name: 'required', message: 'This field is required' },
  ],
  wrappers: [{ name: 'groupwrap', component: FormlyHorizontalWrapper }],
});

const angularModules = [
  CommonModule,
  ReactiveFormsModule,
];

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  FormlyMatToggleModule,
  MatSlideToggleModule,
  MatProgressBarModule
];

const myFormlyModules = [
  SelectWrapperModule,
  EditorWrapperModule,
  FormlyButtionWithActionModule,
];

const formlyModules = [
  // FormlyMaterialModule,
  FormlyModuleMod,
  FormlyMatInputModule,
  FormlyMatToggleModule,
  FormlyMatDatepickerModule,
  MatNativeDateModule,
  FormlyMatSliderModule,
  // custom
  NgStringPipesModule
];

const customComponetns = [
  FormWrapperMaterialComponent,
  IconButtonWithActionComponent,
  RepeatTypeComponent,
  FormlyHorizontalWrapper
];

const entityModules = [
  // ProcessLoggerModule
];

@NgModule({
  imports: [
    ...angularModules,
    ...formlyModules,
    ...myFormlyModules,
    ...materialModules,
    ...entityModules
  ],
  exports: [
    ...myFormlyModules,
    ...customComponetns
  ],
  declarations: [
    ...customComponetns
  ]
})
export class FormWrapperMaterialModule { }
//#region @browser
import { CLASS } from 'typescript-class-helpers';
// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// formly
import { FormlyModule } from '@ngx-formly/core';
// local
import { FormlyButtionWithActionComponent } from './formly-buttion-with-action.component';

export const FormlyModuleMod = FormlyModule.forRoot({
  types: [
    { name: 'button', component: FormlyButtionWithActionComponent },
    { name: CLASS.getName(FormlyButtionWithActionComponent), component: FormlyButtionWithActionComponent }
  ]
});

const angularModules = [
  CommonModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [
    ...angularModules,
    FormlyModuleMod,
  ],
  exports: [FormlyButtionWithActionComponent],
  declarations: [FormlyButtionWithActionComponent]
})
export class FormlyButtionWithActionModule { }
//#endregion

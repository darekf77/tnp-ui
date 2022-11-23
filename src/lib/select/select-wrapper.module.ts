//#region @browser
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// material
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// other
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// local
import { SelectWrapperComponent } from './select-wrapper.component';
// formly
import { FormlyModule } from '@ngx-formly/core';
// import { FormlyMaterialModule, } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import { CLASS } from 'typescript-class-helpers';


const angularModules = [
  ReactiveFormsModule
];

const materialModules = [
  MatSelectModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule
];

export const NgxDatatableModuleMod = NgxDatatableModule.forRoot({
  messages: {
    emptyMessage: 'No data to display', // Message to show when array is presented, but contains no values
    totalMessage: 'total', // Footer total message
    selectedMessage: 'selected' // Footer selected message
  }
});

export const FormlyModuleMod = FormlyModule.forRoot({
  types: [
    { name: 'selectwrapper', component: SelectWrapperComponent },
    { name: CLASS.getName(SelectWrapperComponent), component: SelectWrapperComponent }
  ],
  validationMessages: [
    { name: 'required', message: 'This field is required' },
  ],
});

const moduleOther = [
  NgxDatatableModuleMod
];

const formlyModules = [
  // FormlyMaterialModule,
  FormlyModuleMod,
  FormlyMatToggleModule,
  FormlyMatDatepickerModule,
  MatNativeDateModule,
  FormlyMatSliderModule
];

@NgModule({
  imports: [
    CommonModule,
    ...angularModules,
    ...moduleOther,
    ...materialModules,
    ...formlyModules
  ],
  exports: [
    SelectWrapperComponent
  ],
  declarations: [SelectWrapperComponent]
})
export class SelectWrapperModule { }
//#endregion

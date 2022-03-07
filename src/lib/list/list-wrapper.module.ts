import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// material
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// other
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// local
import { ListWrapperComponent } from './list-wrapper.component';
import { FormlyModule } from '@ngx-formly/core';
import { CLASS } from 'typescript-class-helpers';

const materialModules = [
  MatSelectModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatCardModule
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
    { name: 'listwrapper', component: ListWrapperComponent },
    { name: CLASS.getName(ListWrapperComponent), component: ListWrapperComponent }
  ],
  validationMessages: [
    { name: 'required', message: 'This field is required' },
  ],
});

const moduleOther = [
  NgxDatatableModuleMod
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormlyModuleMod,
    ...moduleOther,
    ...materialModules
  ],
  exports: [
    ListWrapperComponent
  ],
  declarations: [ListWrapperComponent]
})
export class ListWrapperModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//material
import { MatSelectModule } from '@angular/material/select';
// other
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// local
import { TableWrapperComponent } from './table-wrapper.component';

const materialModules = [
  MatSelectModule
];
export const NgxDatatableModuleMod = NgxDatatableModule.forRoot({
  messages: {
    emptyMessage: 'No data to display', // Message to show when array is presented, but contains no values
    totalMessage: 'total', // Footer total message
    selectedMessage: 'selected' // Footer selected message
  }
});

const moduleOther = [
  NgxDatatableModuleMod
];

@NgModule({
  imports: [
    CommonModule,
    ...moduleOther,
    ...materialModules
  ],
  exports: [
    NgxDatatableModule,
    TableWrapperComponent
  ],
  declarations: [TableWrapperComponent]
})
export class TableWrapperModule { }
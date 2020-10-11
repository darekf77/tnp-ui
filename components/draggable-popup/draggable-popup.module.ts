import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatDialogModule } from '@angular/material/dialog';

import { DraggablePopupComponent, DraggablePopupWindowComponent } from './draggable-popup.component';

const angularModules = [
  A11yModule,
  ClipboardModule,
  DragDropModule,
  ScrollingModule,
  CdkStepperModule,
  CdkTableModule,
  CdkTreeModule,
  MatDialogModule,
]

@NgModule({
  imports: [
    CommonModule,
    ...angularModules,
  ],
  exports: [
    DraggablePopupComponent,
    ...angularModules,
  ],
  declarations: [
    DraggablePopupComponent,
    DraggablePopupWindowComponent,
  ],
  entryComponents: [
    DraggablePopupWindowComponent,
  ]
})
export class DraggablePopupModule { }

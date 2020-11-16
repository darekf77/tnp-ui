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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { WebStorageModule } from 'ngx-store';
import { ModalModule } from 'ng4-modal';
import { Ng4IconsModule } from 'ng4-icons';

import { DraggablePopupComponent } from './draggable-popup.component';

const angularModules = [
  A11yModule,
  ClipboardModule,
  DragDropModule,
  ScrollingModule,
  CdkStepperModule,
  CdkTableModule,
  CdkTreeModule,
  MatDialogModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  Ng4IconsModule,
]

@NgModule({
  imports: [
    CommonModule,
    WebStorageModule,
    ModalModule,
    ...angularModules,
  ],
  exports: [
    DraggablePopupComponent,
    ...angularModules,
  ],
  declarations: [
    DraggablePopupComponent,
    // DraggablePopupWindowComponent,
  ],
  entryComponents: [
    // DraggablePopupWindowComponent,
  ]
})
export class DraggablePopupModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';


//#region @cutCodeIfFalse ENV.frameworks.includes('material')
import { MatDialogModule } from '@angular/material/dialog';
const material = [
  MatDialogModule
]
//#endregion

@NgModule({
  imports: [
    CommonModule,
    //#region @cutCodeIfFalse ENV.frameworks.includes('material')
    ...material
    //#endregion
  ],
  exports: [
    ModalComponent
  ],
  declarations: [
    ModalComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule { }
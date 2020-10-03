//#region angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//#endregion

import { MoveablePopupComponent } from './moveable-popup.component';

const angularMOdules = [
  CommonModule
]

const localCmp = [
  MoveablePopupComponent
]

@NgModule({
  imports: [
    ...angularMOdules
  ],
  exports: [
    ...localCmp
  ],
  declarations: [
    ...localCmp
  ]
})
export class MoveablePopupModule { }

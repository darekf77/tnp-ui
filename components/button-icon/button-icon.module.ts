//#region angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonIconComponent } from './button-icon.component';
//#endregion

//#region  material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//#endregion
import { Ng4IconsModule } from 'ng4-icons';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  Ng4IconsModule,
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  declarations: [ButtonIconComponent],
  exports: [ButtonIconComponent]
})
export class ButtonIconModule { }
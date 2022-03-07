import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModTestComponent } from './mod-test.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule
  ],
  declarations: [ModTestComponent],
  exports: [
    ModTestComponent,
    MatCardModule,
  ]
})
export class ModTestModule { }
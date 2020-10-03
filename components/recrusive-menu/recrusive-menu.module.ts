import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecrusiveMenuComponent } from './recrusive-menu.component';
import { NgArrayPipesModule } from 'ngx-pipes';

@NgModule({
  exports: [
    RecrusiveMenuComponent,
    NgArrayPipesModule
  ],
  imports: [
    NgArrayPipesModule,
    CommonModule
  ],
  declarations: [RecrusiveMenuComponent]
})
export class RecrusiveMenuModule { }
``
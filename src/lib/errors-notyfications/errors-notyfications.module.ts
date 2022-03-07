import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorsNotyficationsComponent } from './errors-notyfications.component';
import { ErrorsNotyficationsService } from './errors-notyfications.service';
import { NotificationsModule } from '../notifications';
import { ModalModule } from '../modal';

@NgModule({
  imports: [
    CommonModule,
    NotificationsModule,
    ModalModule
  ],
  exports: [
    ErrorsNotyficationsComponent
  ],
  declarations: [
    ErrorsNotyficationsComponent
  ],
  providers: [
    ErrorsNotyficationsService
  ]
})
export class ErrorsNotyficationsModule { }
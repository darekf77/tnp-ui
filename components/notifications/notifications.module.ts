import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';

import { ToastrModule } from 'ngx-toastr';
import { NotificationsService } from './notifications.service';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
  ],
  declarations: [NotificationsComponent],
  providers: [NotificationsService]
})
export class NotificationsModule { }
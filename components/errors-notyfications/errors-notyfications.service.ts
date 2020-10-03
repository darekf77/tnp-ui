import { NotificationsService } from '../notifications/notifications.service';
import { ModalService } from '../modal/modal.service';
import { Resource } from 'ng2-rest';
import { Subscription } from 'rxjs';
import { TemplateRef, Injectable } from '@angular/core';

@Injectable()
export class ErrorsNotyficationsService {

  constructor(
    private notification: NotificationsService,
    private modal: ModalService
  ) {

  }

  init(subscribtionsArray: Subscription[], template: TemplateRef<any>, callback: (dataToTempalte) => any) {

    subscribtionsArray.push(Resource.listenErrors.subscribe(err => {
      const notify = this.notification.error(err.msg);

      subscribtionsArray.push(notify.onTap.subscribe(() => {
        callback(err);
        this.modal.open(template);
      }) as any);
    }) as any);
  }

}
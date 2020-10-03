import * as _ from 'lodash';
import { Injectable } from '@angular/core';

import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { NotificaitonModel } from './notification-model';

export type NotificationOptions = { title: string; subtitle?: string; };

@Injectable()
export class NotificationsService {

  private config: Partial<IndividualConfig> = {
    closeButton: true,
    easeTime: 5500
  };

  constructor(
    private toast: ToastrService
  ) {

  }

  private meta(type: 'success' | 'error' | 'warning' | 'info', options: NotificationOptions | string) {
    if (_.isString(options)) {
      options = {
        title: options
      };
    }
    const { title, subtitle } = options;
    const t = this.toast[type](title, subtitle, this.config);
    return new NotificaitonModel(t);
  }

  success(options: NotificationOptions | string) {
    return this.meta('success', options);
  }

  error(options: NotificationOptions | string) {
    return this.meta('error', options);
  }

  warn(options: NotificationOptions | string) {
    return this.meta('warning', options);
  }

  info(options: NotificationOptions | string) {
    return this.meta('info', options);
  }


}
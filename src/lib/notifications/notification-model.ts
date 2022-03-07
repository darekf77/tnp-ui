import { ActiveToast } from 'ngx-toastr';

export class NotificaitonModel {

  constructor(private data: ActiveToast<any>) {

  }

  get onTap() {
    return this.data.onTap;
  }

  close() {
    this.data.toastRef.close();
  }

}
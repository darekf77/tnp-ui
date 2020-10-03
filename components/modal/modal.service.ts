//#region @cutCodeIfFalse ENV.frameworks.includes('material')
import { MatDialog } from '@angular/material/dialog';
//#endregion

import { TemplateRef, Injectable } from '@angular/core';

declare const ENV: any;

@Injectable()
export class ModalService {

  constructor(
    //#region @cutCodeIfFalse ENV.frameworks.includes('material')
    public dialogMaterial: MatDialog,
    //#endregion
  ) {

  }


  open<T = any>(template: TemplateRef<T>) {

    //#region @cutCodeIfFalse ENV.frameworks.includes('material')
    if (ENV.frameworks.includes('material')) {
      this.dialogMaterial.open(template);
    }
    //#endregion
    //#region @cutCodeIfFalse ENV.frameworks.includes('bootstrap')
    if (ENV.frameworks.includes('bootstrap')) {
      console.log('Bootstrap modal !!!')
    }
    //#endregion
  }

  close() {

  }

}
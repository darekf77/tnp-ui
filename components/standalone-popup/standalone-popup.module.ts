import { NgModule } from '@angular/core';

import { StandalonePopupComponent } from './standalone-popup.component';
import { PopupComponent } from './popup-component/popup.component';


@NgModule({
    entryComponents: [StandalonePopupComponent, PopupComponent],
    exports: [StandalonePopupComponent, PopupComponent],
    declarations: [StandalonePopupComponent, PopupComponent]
})
export class StandalonePopupModule { }
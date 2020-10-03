import { ComponentRef } from '@angular/core';

export class PopupInfo {
    popup: ComponentRef<any>;
    modal: HTMLElement;
    wrapper: HTMLElement;
    contrlPanel: HTMLElement;
    popupContent: HTMLElement;
    dragXOffset = 0;
    dragYOffset = 0;
    constructor() {
    }

}
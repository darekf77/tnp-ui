import * as _ from 'lodash';
import { PopupInfo } from './popup-info';
import {
  ViewContainerRef, ComponentFactoryResolver, ComponentRef,
  TemplateRef, ElementRef, EventEmitter
} from '@angular/core';

import { HTMLElementUtil } from './html-utls';

const coordinateX = 'coordinateX';
const coordinateY = 'coordinateY';


export class PopupControler {
  private static ids = 0;
  public onClose: EventEmitter<any>;

  public onPin: EventEmitter<any>;

  private bodyHtml: HTMLElement;

  modalZIndex = 10000;
  popupQueue: PopupInfo[] = [];
  id: string;
  constructor(private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    id?: string,
    private title?: string,
    private pinned = false
  ) {
    if (_.isUndefined(id)) {
      this.id = `${PopupControler.ids++}inside`;
    } else {
      this.id = id;
    }

  }

  reinitPos() {
    const x = Number(localStorage.getItem(`${coordinateX}${this.id}`));
    const y = Number(localStorage.getItem(`${coordinateY}${this.id}`));
    if (!_.isNaN(x) && !_.isNaN(y)) {
      this.moveTo(x, y);
    }
  }

  async setContentComponent(component: TemplateRef<any>): Promise<ComponentRef<any>> {

    const pInfo: PopupInfo = new PopupInfo();
    const popupFactory = this.componentFactoryResolver
      .resolveComponentFactory(await (await (import('../popup-component/popup.component'))).PopupComponent);

    const popupRef = this.viewContainerRef
      .createComponent(popupFactory);

    popupRef.instance.parent = this;
    popupRef.instance.template = component;
    popupRef.instance.title = this.title;
    popupRef.instance.pinned = this.pinned;

    if (this.bodyHtml == null) {
      try {
        this.bodyHtml = this.getBody(popupRef.location.nativeElement);
      } catch (e) {
        return;
      }

    }
    pInfo.popup = popupRef;
    this.findPopupWrapperAndContent(pInfo.popup.location.nativeElement, pInfo);
    // Move the wrapper to the body tag
    HTMLElementUtil.RemoveElement(pInfo.popup.location.nativeElement);
    this.bodyHtml.appendChild(pInfo.popup.location.nativeElement);

    this.popupQueue.push(pInfo);
    this.centerPositioning(pInfo.wrapper);
    return popupRef;
  }

  public pin = (value) => {
    if (this.onClose.observers.length > 0) {
      this.onPin.next(value)
    }
  }

  public close = () => {
    if (this.onClose.observers.length > 0) {
      this.onClose.next();
      if (this.popupQueue.length > 0) {
        const popup = this.popupQueue.pop();
        HTMLElementUtil.RemoveElement(popup.popup.location.nativeElement);
      }
    }

  }

  public StartDragAt(startX: number, startY: number) {
    const popup = this.popupQueue[this.popupQueue.length - 1];

    const top: number = + popup.wrapper.style.top.replace('px', '');
    const left: number = + popup.wrapper.style.left.replace('px', '');
    popup.dragYOffset = startY - top;
    popup.dragXOffset = startX - left;
  }


  public moveTo(x: number, y: number) {

    const popup = this.popupQueue[this.popupQueue.length - 1];

    popup.wrapper.style.top = (y - popup.dragYOffset) + 'px';
    popup.wrapper.style.left = (x - popup.dragXOffset) + 'px';

    window.localStorage.setItem(`${coordinateX}${this.id}`, (x - popup.dragXOffset).toString());
    window.localStorage.setItem(`${coordinateY}${this.id}`, (y - popup.dragYOffset).toString());
  }
  private findPopupWrapperAndContent = (popup: HTMLElement, popupInfo: PopupInfo) => {

    for (let i = 0; i < popup.children.length; ++i) {
      const c = popup.children[i] as HTMLElement;

      if (c != null) {
        switch (c.className) {
          case 'popup-modal':
            popupInfo.modal = c;
            break;
          case 'popup-wrapper':
            popupInfo.wrapper = c;
            break;
          case 'popup-controlPanel':
            popupInfo.contrlPanel = c;
            break;
          case 'popup-content':
            popupInfo.popupContent = c;
            break;

        }
        this.findPopupWrapperAndContent(c, popupInfo);
      }
    }

  }
  private centerPositioning = (wrapper: HTMLElement): HTMLElement => {

    if (wrapper != null) {
      const modal: HTMLElement = wrapper.parentElement;

      const left: number = ((modal.clientWidth - wrapper.clientWidth) / 2) | 0;
      const top: number = ((modal.clientHeight - wrapper.clientHeight) / 2) | 0;
      wrapper.style.top = top + 'px';
      wrapper.style.left = left + 'px';
      const y = wrapper.clientTop;
      const x = wrapper.clientTop;


    }
    return wrapper;
  }
  private getBody = (fromEl: HTMLElement): HTMLElement => {
    let b: HTMLElement = fromEl;
    do {
      b = b.parentElement;
    } while (b.tagName !== 'BODY');
    return b;

  }
}
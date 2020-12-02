import * as _ from 'lodash';
import {
  Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject,
  ComponentFactoryResolver, EventEmitter, Output, ElementRef, ViewEncapsulation, AfterViewInit
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorage } from 'ngx-store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Log, Level } from 'ng2-logger';
import { ConfigModels } from 'tnp-config';
const log = Log.create('draggable popup component', Level.__NOTHING);

import { mdiBell } from '@mdi/js';

const modalPosLeft = 100;
const modalPosTop = 100;
const modalWidth = (window.innerWidth / 2) || 400;
const modalHeight = 260;

export type IPosition = {
  left: number;
  top: number;

}

export type PositionType = {
  [key: string]: IPosition;
} & { save?: () => void; };

export type ISize = {
  height: number;
  width: number;
}

export type SizeType = {
  [key: string]: ISize;
} & { save?: () => void; };


@Component({
  selector: 'app-draggable-popup',
  templateUrl: 'draggable-popup.component.html',
  styleUrls: ['draggable-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DraggablePopupComponent implements OnInit, AfterViewInit {

  static popups: { [id: string]: DraggablePopupComponent } = {};
  isBeforeNgInit = true;
  // @ViewChild('content') content: ElementRef;
  @ViewChild('modalRoot') modalRoot: {
    show: () => any;
    hide: () => any;
    backdrop: boolean;
  };
  @Input() public id: string;
  @Input() public title = '';
  @Input() public isOpen: boolean;
  @Output() public onPin = new EventEmitter();
  @Input() pinned: boolean;

  public get height() {
    if (this.id && this.sizeById[this.id]) {
      return this.sizeById[this.id].height;
    }
  }

  @LocalStorage() public positionsById: PositionType;
  @LocalStorage() public sizeById: SizeType;

  // @LocalStorage() private pinnedById: {
  //   [key: string]: boolean;
  // } & { save: () => void; } = {} as any;


  // private usePinnedValueFromStorage = true;
  public get isPinned() {
    return this.pinned;
    // if (this.isBeforeNgInit) {
    //   return this.pinned;
    // }
    // if(this.usePinnedValueFromStorage) {
    //   return this.pinnedById[this.id];
    // }
    // return this.usePinnedValueFromStorage;
  }

  public set isPinned(v: boolean) {
    this.pinned = v;
    this.onPin.next(v);
    // if (this.isBeforeNgInit) {
    //   return;
    // }
    // if(this.usePinnedValueFromStorage) {
    //   this.pinnedById[this.id] = v;
    // } else {
    //   // @ts-ignore
    //   this.pinned = v;
    // }
    // this.onPin.next(v);
  }

  // public dialogRef: MatDialogRef<DraggablePopupWindowComponent>;

  constructor(
    public dialog: MatDialog,

  ) {
    console.log(mdiBell)
  }

  reset() {
    this.positionsById[this.id] = void 0;
    this.sizeById[this.id] = void 0;
    this.init(false);
  }

  initialSize: ConfigModels.Size;
  initialPos: ConfigModels.Position;
  init(open = true) {
    log.i(`Initing with id=${this.id}`)
    const position: IPosition = this.positionsById[this.id] ? this.positionsById[this.id] : {
      left: modalPosLeft,
      top: modalPosTop
    } as any;
    this.positionsById[this.id] = position as any;
    this.positionsById.save();
    log.i(`localStoragePositionAvailable`, position);

    const size: ISize = this.sizeById[this.id] ? this.sizeById[this.id] : {
      x: modalWidth,
      y: modalHeight,
    } as any;
    this.sizeById[this.id] = size;
    this.sizeById.save()
    log.i(`localStorageSizeAvailable`, size);

    this.initialPos = {
      x: position.left,
      y: position.top,
    }
    this.initialSize = {
      w: size.width,
      h: size.height,
    }
    if (open) {
      setTimeout(() => {
        this.modalRoot.show();
      });
    }

  }

  async ngOnInit() {
    this.positionsById = this.positionsById ? this.positionsById : {} as any;
    this.sizeById = this.sizeById ? this.sizeById : {} as any;
    // if (_.isUndefined(this.pinned)) {
    //   this.usePinnedValueFromStorage = true;
    // }
    this.isBeforeNgInit = false;
    const idAvailable = (!_.isNil(this.id) && !_.isObject(this.id));
    // if (idAvailable) {
    //   DraggablePopupComponent.popups[this.id] = this;
    // }

  }

  ngAfterViewInit() {
    if (this.isOpen) {
      setTimeout(() => {
        this.init();
      });
    }
  }

  ngOnDestroy(): void {
    // this.dialogRef?.close()
    this.modalRoot.hide();
  }

  closePopup() {
    this.setPinned(false);
    this.modalRoot.hide()
  }
  setPinned(v: boolean) {
    if (this.id) {
      this.isPinned = v;
    }

  }

  newSize(size: ConfigModels.Size) {
    if (!this.id) {
      log.w(`no praent id... no update for local sorage values`);
      return;
    }
    log.i(`Updating local sorage size values`)
    this.sizeById[this.id].width = size.w;
    this.sizeById[this.id].height = size.h;
    this.sizeById = this.sizeById;
    this.sizeById.save();
    log.i(`saved size id=${this.id}`, this.sizeById[this.id]);
  }

  newPosition(pos: ConfigModels.Position) {
    if (!this.id) {
      log.w(`no praent id... no update for local sorage values`);
      return;
    }
    log.i(`Updating local sorage position values`)
    this.positionsById[this.id].left = pos.x;
    this.positionsById[this.id].top = pos.y;
    this.positionsById = this.positionsById;
    this.positionsById.save();
    log.i(`saved position id=${this.id}`, this.positionsById[this.id]);
  }

}

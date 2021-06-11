//#region imports
import * as _ from 'lodash';
import {
  Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject,
  SimpleChanges,
  ComponentFactoryResolver, EventEmitter, Output, ElementRef, ViewEncapsulation, AfterViewInit
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorage } from 'ngx-store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Log, Level } from 'ng2-logger';
import { ConfigModels } from 'tnp-config';
//#endregion

//#region consts
const debug = true;
const log = Log.create('draggable popup component',
  debug ? Level.INFO: Level.__NOTHING,
);
const modalPosLeft = 100;
const modalPosTop = 100;
const modalWidth = (window.innerWidth / 2) || 400;
const modalHeight = 260;
//#endregion

//#region modals
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

//#endregion

@Component({
  selector: 'app-draggable-popup',
  //#region component options
  templateUrl: 'draggable-popup.component.html',
  styleUrls: ['draggable-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  //#endregion
})
export class DraggablePopupComponent {

  //#region getters / setters / fields
  public get isPinned() {
    return this.pinned;
  }

  public set isPinned(v: boolean) {
    this.pinned = v;
    this.onPin.next(v);
  }

  public get debugInfo() {
    if(debug) {
      return `(h:${this.height},w: ${this.width}, l: ${this.left}, t: ${this.top})`
    }
    return '';
  }

  public get height() {
    if (this.id && this.sizeById[this.id]) {
      return this.sizeById[this.id].height;
    }
  }

  public get width() {
    if (this.id && this.sizeById[this.id]) {
      return this.sizeById[this.id].width;
    }
  }

  public get left() {
    if (this.id && this.positionsById[this.id]) {
      return this.positionsById[this.id].left;
    }
  }

  public get top() {
    if (this.id && this.positionsById[this.id]) {
      return this.positionsById[this.id].top;
    }
  }

  initialSize: ConfigModels.Size;
  initialPos: ConfigModels.Position;

  @LocalStorage() public positionsById: PositionType;
  @LocalStorage() public sizeById: SizeType;


  @ViewChild('modalRoot') modalRoot: {
    show: () => any;
    hide: () => any;
    backdrop: boolean;
  };
  //#endregion

  //#region inputs
  @Input() public id: string;
  @Input() public title = '';
  @Input() public isOpen: boolean = true;
  @Output() public onPin = new EventEmitter();
  @Input() pinned: boolean;
  //#endregion

  //#region constructor
  constructor(
    public dialog: MatDialog,

  ) { }
  //#endregion

  //#region angular hooks
  async ngOnInit() {
    this.positionsById = this.positionsById ? this.positionsById : {} as any;
    this.sizeById = this.sizeById ? this.sizeById : {} as any;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.isOpen) {
      this.debounceOpen();
    }
  }

  ngAfterViewInit() {
    if (this.isOpen) {
      this.init();
    }
  }

  ngOnDestroy(): void {
    // this.dialogRef?.close()
    this.modalRoot.hide();
  }
  //#endregion

  //#region public api

  //#region reset
  public reset() {
    this.positionsById[this.id] = void 0;
    this.sizeById[this.id] = void 0;
    this.init(false);
  }
  //#endregion

  //#region close
  closePopup() {
    this.setPinned(false);
    this.modalRoot.hide()
  }
  //#endregion

  //#region set pinned
  public setPinned(v: boolean) {
    if (this.id) {
      this.isPinned = v;
    }
  }
  //#endregion

  //#region save new size
  protected saveNewSize(size: ConfigModels.Size) {
    if (!this.id) {
      log.w(`no praent id... no update for local sorage values`);
      return;
    }
    log.i(`Updating local storage size values`)
    this.sizeById[this.id].width = size.w;
    this.sizeById[this.id].height = size.h;
    this.sizeById = this.sizeById;
    this.sizeById.save();
    log.i(`saved size id=${this.id}`, this.sizeById[this.id]);
  }
  //#endregion

  //#region save new position
  protected saveNewPosition(pos: ConfigModels.Position) {
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
  //#endregion

  //#endregion

  //#region private methods

  //#region debouce toogle open / close
  private debounceOpen = _.debounce(() => {
    if (this.isOpen) {
      this.init(true);
    } else {
      this.closePopup();
    }
  }, 100);
  //#endregion

  //#region init

  private init(open = true) {
    setTimeout(() => {
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
    });
  }
  //#endregion

  //#endregion

}

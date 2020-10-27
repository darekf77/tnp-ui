import * as _ from 'lodash';
import {
  Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject,
  ComponentFactoryResolver, EventEmitter, Output, ElementRef, ViewEncapsulation
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorage } from 'ngx-store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Log, Level } from 'ng2-logger';
const log = Log.create('draggable popup component')

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
export class DraggablePopupComponent implements OnInit {
  static popups: { [id: string]: DraggablePopupComponent } = {};
  isBeforeNgInit = true;
  @ViewChild('content') content: ElementRef;
  @Input() public id: string;
  @Input() public title = '';
  @Input() public isOpen: boolean;
  @Output() public onPin = new EventEmitter();
  @Input() pinned: boolean;

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

  public dialogRef: MatDialogRef<DraggablePopupWindowComponent>;

  constructor(
    public dialog: MatDialog) {
  }

  init() {
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

    this.dialogRef = this.dialog.open(DraggablePopupWindowComponent, {
      position: {
        left: `${position.left}px`,
        top: `${position.top}px`,
      },
      // height: `${modalHeight}px`,
      width: `${modalWidth}px`,
      hasBackdrop: false,
      disableClose: true,
      panelClass: 'resizable-modal',
      data: this
    });


    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

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
    if (this.isOpen) {
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.dialogRef?.close()
  }

}

//#region popup window
@Component({
  selector: 'app-draggable-popup-window',
  template: `

  <h1 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane"
  cdkDragHandle style="padding-right:0px;"
   (cdkDragEnded)="dropped($event)"
   >
  <span>{{parent.title}}</span>
      <button mat-button type="button" style="cursor:pointer;float:right;" (click)="closePopup()">
        <mat-icon>close</mat-icon>
      </button>
      <button *ngIf="parent.id" mat-button type="button" style="cursor:pointer;float:right;" (click)="setPinned(!parent.isPinned)"  >
            <mat-icon>{{ parent.isPinned ? 'visibility': 'visibility_off' }}</mat-icon>
      </button>
  </h1>
<div mat-dialog-content >
  <div #container ></div>
</div>
<div mat-dialog-actions>
  <button mat-button cdkFocusInitial (click)="closePopup()">Close</button>
</div>

  `,
  styles: [``],
})
export class DraggablePopupWindowComponent {
  @ViewChild('container', { read: ViewContainerRef }) view;
  constructor(public dialogRef: MatDialogRef<DraggablePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public parent: DraggablePopupComponent,
  ) { }

  dropped(event: CdkDragDrop<string[]>) {
    if (!this.parent.id) {
      log.w(`no praent id... no update for local sorage values`);
      return;
    }
    log.i(`Updating local sorage values`)
    const distance = event.distance;
    let currentPos = this.parent.positionsById[this.parent.id];
    log.i(`currentPos`, currentPos);
    if (!currentPos) {
      this.parent.positionsById[this.parent.id] = {
        left: modalPosLeft,
        top: modalPosTop,
      };
      currentPos = this.parent.positionsById[this.parent.id];
    }
    this.parent.positionsById[this.parent.id].left = (currentPos.left + distance.x);
    this.parent.positionsById[this.parent.id].top = (currentPos.top + distance.y);
    this.parent.positionsById = this.parent.positionsById;
    this.parent.positionsById.save();
    log.i(`saved position id=${this.parent.id}`, this.parent.positionsById[this.parent.id])
  }

  closePopup() {
    this.setPinned(false);
    this.dialogRef.close();
  }
  setPinned(v: boolean) {
    if (this.parent.id) {
      this.parent.isPinned = v;
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.view.createEmbeddedView(this.parent.content);
    });
  }

}
//#endregion

import * as _ from 'lodash';
import {
  Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject,
  ComponentFactoryResolver, EventEmitter, Output, ElementRef, ViewEncapsulation
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorage } from 'ngx-store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

const modalPosLeft = 100;
const modalPosTop = 100;
const modalWidth = (window.innerWidth / 2) || 400;
const modalHeight = 260;

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

  @LocalStorage() public positionsById: {
    [key: string]: { left: number; top: number; }
  } & { save: () => void; };

  @LocalStorage() public sizeById: {
    [key: string]: { height: number; width: number; }
  } & { save: () => void; };

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
    const localStoragePositionAvailable = this.positionsById[this.id];

    const currentPos = {
      modalPosLeft: modalPosLeft,
      modalPosTop: modalPosTop
    }
    if (localStoragePositionAvailable) {
      currentPos.modalPosLeft = this.positionsById[this.id].left;
      currentPos.modalPosTop = this.positionsById[this.id].top;
    }

    const localStorageSizeAvailable = this.sizeById[this.id];

    const currentSize = {
      modalHeight: modalHeight,
      modalWidth: modalWidth,
    }
    if (localStorageSizeAvailable) {
      currentSize.modalHeight = this.sizeById[this.id].height;
      currentSize.modalWidth = this.sizeById[this.id].width;
    }

    this.dialogRef = this.dialog.open(DraggablePopupWindowComponent, {
      position: {
        left: `${currentPos.modalPosLeft}px`,
        top: `${currentPos.modalPosTop}px`,
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
    if (this.parent.id) {
      const distance = event.distance;
      let currentPos = this.parent.positionsById[this.parent.id];
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
      this.parent.positionsById.save()
    }
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

import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject, ComponentFactoryResolver, EventEmitter, Output, ElementRef, ViewEncapsulation } from '@angular/core';
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
  @ViewChild('content') content: ElementRef;
  @Input() public id: string;
  @Input() public title = '';
  @Output() public close = new EventEmitter();
  @Output() public pin = new EventEmitter();

  @LocalStorage() public positionsById: {
    [key: string]: { left: number; top: number; }
  } & { save: () => void; } = {} as any;

  @LocalStorage() public sizeById: {
    [key: string]: { height: number; width: number; }
  } & { save: () => void; } = {} as any;

  @LocalStorage() public pinnedById: {
    [key: string]: boolean;
  } & { save: () => void; } = {} as any;

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
    const idAvailable = (!_.isNil(this.id) && !_.isObject(this.id));
    if (idAvailable) {
      DraggablePopupComponent.popups[this.id] = this;
    }
    this.init();
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
      <button *ngIf="parent.id" mat-button type="button" style="cursor:pointer;float:right;" (click)="setPinned(!parent.pinned)"  >
            <mat-icon>{{ parent.pinned ? 'visibility': 'visibility_off' }}</mat-icon>
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
    if(this.parent.id) {
      this.parent.pinnedById[this.parent.id] = v;
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.view.createEmbeddedView(this.parent.content);
    });
  }

}
//#endregion

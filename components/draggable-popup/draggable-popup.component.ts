import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorage } from 'ngx-store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-draggable-popup',
  templateUrl: 'draggable-popup.component.html',
  styleUrls: ['draggable-popup.component.css']
})
export class DraggablePopupComponent implements OnInit {
  static popups: { [id: string]: DraggablePopupComponent } = {};
  @ViewChild('popupRoot', { read: ViewContainerRef }) parent: ViewContainerRef;
  @Input() public popupContent: TemplateRef<any>;
  @Input() public id: string;
  @Input() public title = '';
  @LocalStorage() @Input() public pinned = false;
  @Output() public close = new EventEmitter();
  @Output() public pin = new EventEmitter();
  @LocalStorage() public positionsById: {
    [key: string]: { left: number; top: number; }
  } & { save: () => void; } = {} as any;

  @LocalStorage() public sizeById: {
    [key: string]: { height: number; width: number; }
  } & { save: () => void; } = {} as any;

  public dialogRef: MatDialogRef<DraggablePopupWindowComponent>;

  constructor(
    public dialog: MatDialog) {
  }

  init() {
    const localStoragePositionAvailable = this.positionsById[this.id];
    let modalPosX = 100;
    let modalPosY = 100;
    if (localStoragePositionAvailable) {
      modalPosX = this.positionsById[this.id].left;
      modalPosY = this.positionsById[this.id].top;
    }

    const localStorageSizeAvailable = this.sizeById[this.id];
    let modalWidth = 400;
    let modalHeight = 260;
    if (localStorageSizeAvailable) {
      modalHeight = this.sizeById[this.id].height;
      modalWidth = this.sizeById[this.id].width;
    }

    this.dialogRef = this.dialog.open(DraggablePopupWindowComponent, {
      position: !localStoragePositionAvailable ? void 0 : {
        left: `${modalPosX}px`,
        top: `${modalPosY}px`,
      },
      // height: `${modalHeight}px`,
      width: `${modalWidth}px`,
      hasBackdrop: false,
      disableClose: true,
      data: this
    });


    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  async ngOnInit() {
    if (!_.isNil(this.id) && !_.isObject(this.id)) {
      DraggablePopupComponent.popups[this.id] = this;
    }
    if (this.pinned) {
      this.init();
    }
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
      <button mat-button type="button" style="cursor:pointer;float:right;" (click)="setPinned(!parent.pinned)"  >
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
      this.parent.positionsById[this.parent.id].left = this.parent.positionsById[this.parent.id].left + distance.x;
      this.parent.positionsById[this.parent.id].top = this.parent.positionsById[this.parent.id].top + distance.y;
      this.parent.positionsById = this.parent.positionsById;
      this.parent.positionsById.save()
    }
  }

  closePopup() {
    this.setPinned(false);
    this.dialogRef.close();
  }
  setPinned(v: boolean) {
    this.parent.pinned = v;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.view.createEmbeddedView(this.parent.popupContent);
    });
  }

}
//#endregion

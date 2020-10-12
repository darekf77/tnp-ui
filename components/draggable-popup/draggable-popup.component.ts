import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  @Input() public pinned = false;
  @Output() public close = new EventEmitter();
  @Output() public pin = new EventEmitter();
  public dialogRef: MatDialogRef<DraggablePopupWindowComponent>;

  constructor(
    public dialog: MatDialog) {
  }

  // reinitPos() { // TODO
  //   const x = Number(localStorage.getItem(`${coordinateX}${this.id}`));
  //   const y = Number(localStorage.getItem(`${coordinateY}${this.id}`));
  //   if (!_.isNaN(x) && !_.isNaN(y)) {
  //     this.moveTo(x, y);
  //   }
  // }

  init() {
    // @ts-ignore
    this.dialogRef = this.dialog.open(DraggablePopupWindowComponent, {
      width: '400px',
      hasBackdrop: false,
      disableClose: true,
      data: this
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  // public pin = (value) => {
  //   if (this.onClose.observers.length > 0) {
  //     this.onPin.next(value)
  //   }
  // }

  async ngOnInit() {
    if (!_.isNil(this.id) && !_.isObject(this.id)) {
      DraggablePopupComponent.popups[this.id] = this;
    }
    if (this.pinned) {
      this.init();
    }
  }

}


@Component({
  selector: 'app-draggable-popup-window',
  template: `

  <h1 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>
  <span>{{parent.title}}</span>
      <input type="checkbox" (change)="changePinned($event)"  [checked]="parent.pinned"  > pin &nbsp;&nbsp;&nbsp;
      <label style="cursor:pointer;" (click)="closePopup()">X</label>
  </h1>
<div mat-dialog-content >
  <p>What's your favorite animal?</p>

  <div #container ></div>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button mat-button cdkFocusInitial>Ok</button>
</div>


  `,
  styles: [``],
})

export class DraggablePopupWindowComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) view;
  constructor(public dialogRef: MatDialogRef<DraggablePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public parent: DraggablePopupComponent,
  ) { }


  ngOnInit() { }
  onNoClick() { }
  closePopup() {
    this.dialogRef.close();
  }
  changePinned(e) {
    console.log('pinned', e.target.checked)
    this.parent.pinned = e.target.checked;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.view.createEmbeddedView(this.parent.popupContent);
    });
  }

}

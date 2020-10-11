import { Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, Inject, ComponentFactoryResolver } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-draggable-popup',
  templateUrl: 'draggable-popup.component.html',
  styleUrls: ['draggable-popup.component.css']
})
export class DraggablePopupComponent implements OnInit {
  @ViewChild('popupRoot', { read: ViewContainerRef }) parent: ViewContainerRef;

  @Input() public popupContent: TemplateRef<any>;
  public dialogRef: MatDialogRef<DraggablePopupWindowComponent>;

  constructor(
    public dialog: MatDialog) {
  }

  trigger() {
    this.dialogRef = this.dialog.open(DraggablePopupWindowComponent, {
      width: '250px',
      hasBackdrop: false,
      disableClose: true,
      data: this
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  async ngOnInit() {

  }

}


@Component({
  selector: 'app-draggable-popup-window',
  template: `

  <h1 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>Hi</h1>
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
    @Inject(MAT_DIALOG_DATA) public data: DraggablePopupComponent,
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  onNoClick() {

  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.view.createEmbeddedView(this.data.popupContent,
        //   , {
        //   model: this.model,
        //   dialog: {
        //     close: () => this.onClose()
        //   }
        // }
      );

    });

  }

}

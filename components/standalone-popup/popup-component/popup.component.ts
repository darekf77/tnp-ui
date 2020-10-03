import {
  Component, OnInit, Input, ViewChild,
  ViewContainerRef, TemplateRef, AfterViewInit
} from '@angular/core';
import { PopupControler } from '../model/popup-controller';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef }) view;
  @Input() public parent: PopupControler;
  @Input() public template: TemplateRef<any>;

  @Input() public title: string;

  @Input() public pinned = false;

  changePinned(e) {
    console.log('pinned', e.target.checked)
    this.parent.pin(e.target.checked)
  }

  closePopup(): void {
    this.parent.close();
  }
  mousedown(e: MouseEvent) {
    this.parent.StartDragAt(e.x, e.y);
  }
  dragging(e: DragEvent): void {
    e.preventDefault();
    if (e.x > 0 && e.y > 0) {
      this.parent.moveTo(e.clientX, e.clientY);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.view.createEmbeddedView(this.template
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
import {
  Component, OnInit, ViewChild, ElementRef,
  HostBinding, Input, Output, EventEmitter
} from '@angular/core';
import * as _ from 'lodash';


const coordinateX = 'coordinateX';
const coordinateY = 'coordinateY';

@Component({
  selector: 'app-moveable-popup',
  templateUrl: './moveable-popup.component.html',
  styleUrls: ['./moveable-popup.component.scss']
})
export class MoveablePopupComponent implements OnInit {

  @ViewChild('modal') modalRef: ElementRef;
  @Input() title = 'Modal title'
  @Input() id: string;
  @Output() pin = new EventEmitter();
  @Output() close = new EventEmitter();
  @Input() public pinned = false;

  changePinned(e) {
    console.log('pinned', e.target.checked)
    this.pin.next(e.target.checked)
  }


  modalTop = 100;
  modalLeft = 100;
  modalHeight = 300;
  modalWidth = 640;

  get wrapper(): HTMLElement {
    return this.modalRef && this.modalRef.nativeElement;
  }

  constructor() { }

  ngOnInit() {
    const x = Number(localStorage.getItem(`${coordinateX}${this.id}`));
    const y = Number(localStorage.getItem(`${coordinateY}${this.id}`));
    if (!_.isNaN(x) && !_.isNaN(y)) {
      this.moveTo(x, y);
    }
  }

  closePopup(): void {
    this.close.next()
  }

  mousedown(e: MouseEvent) {
    this.dragTo(e.x, e.y);
  }
  onDragEnd(e: DragEvent) {
    console.log('drag end', e);
    e.preventDefault();
    if (e.x > 0 && e.y > 0) {
      this.moveTo(e.clientX, e.clientY);
    }
  }


  dragging(e: DragEvent): void {
    e.preventDefault();
    if (e.x > 0 && e.y > 0) {
      this.moveTo(e.clientX, e.clientY);
    }

  }

  offsetdrag = {
    Y: 0,
    X: 0
  }
  dragTo(startX: number, startY: number) {

    this.offsetdrag.Y = startY - this.modalTop;
    this.offsetdrag.X = startX - this.modalLeft;
  }

  moveTo(x: number, y: number) {

    this.modalTop = (y - this.offsetdrag.Y)
    this.modalLeft = (x - this.offsetdrag.X)

    window.localStorage.setItem(`${coordinateX}${this.id}`, (x - this.offsetdrag.X).toString());
    window.localStorage.setItem(`${coordinateY}${this.id}`, (y - this.offsetdrag.Y).toString());
  }

}

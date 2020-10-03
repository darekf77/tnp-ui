import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss']
})
export class ButtonIconComponent implements OnInit {

  @Input() icon = 'home';
  @Input() label = 'Button';
  @Input() disabled = false;

  @Input() color: string = void 0;

  @Output() action = new EventEmitter();

  onAction() {
    this.action.next()
  }

  constructor() { }

  ngOnInit() {
  }

}

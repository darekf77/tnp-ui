import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recrusive-menu',
  templateUrl: './recrusive-menu.component.html',
  styleUrls: ['./recrusive-menu.component.scss']
})
export class RecrusiveMenuComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() selectedItem: any;
  @Input() childrenProperty = 'children';
  @Input() nameProperty = 'name';
  @Input() filter = {
    props: [],
    values: [],
    levels: []
  }

  get cfilter() {
    return this.filter.levels.includes(this.level) ? this.filter : {
      props: [],
      values: []
    }
  }

  @Input() level = 0;

  @Output() selected = new EventEmitter();
  onSelected(item: any) {
    this.selectedItem = item;
    this.selected.next(item);
  }

  constructor() { }

  ngOnInit() {
    // console.log(this.filter)
    // debugger
  }

}
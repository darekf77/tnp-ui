import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from 'tnp-helpers';
import { ErrorsNotyficationsService } from './errors-notyfications.service';

export type Ng2RestData = {
  msg: string;
  stack: string[];
}

@Component({
  selector: 'app-errors-notyfications',
  templateUrl: './errors-notyfications.component.html',
  styleUrls: ['./errors-notyfications.component.scss']
})
export class ErrorsNotyficationsComponent extends BaseComponent implements AfterViewInit {

  data: Ng2RestData;
  @ViewChild('tmp') template: TemplateRef<any>;
  constructor(
    private notificaitonService: ErrorsNotyficationsService
  ) {
    super()
      ;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.notificaitonService.init(this.handlers as any, this.template, ((data: Ng2RestData) => {
        this.data = data;
      }));
    });
  }

}

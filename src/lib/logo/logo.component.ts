import { Component, OnInit } from '@angular/core';
import { Log, Level } from 'ng2-logger';

const log = Log.create('logo module');


@Component({
  selector: 'app-logo',
  templateUrl: 'logo.component.html',
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
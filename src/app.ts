//#region @notForNpm
//#region @browser
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
selector: 'app-tnp-ui',
template: 'hello from tnp-ui'
})
export class TnpUiComponent implements OnInit {
constructor() { }

ngOnInit() { }
}

@NgModule({
imports: [],
exports: [TnpUiComponent],
declarations: [TnpUiComponent],
providers: [],
})
export class TnpUiModule { }
//#endregion

//#region @backend
async function start(port: number)  {

}

export default start;

//#endregion

//#endregion
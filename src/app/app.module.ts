//#region imports angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Route, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const angularModules = [
  BrowserModule,
  FormsModule,
  BrowserAnimationsModule,
  RouterModule.forRoot(
    [
      // { path: "", component: LoginComponent}
    ]
  ),
]
//#endregion

//#region import angular material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
const angularMaterial = [
  MatExpansionModule,
  MatTabsModule,
]
//#endregion

//#region imports local components
import { DraggablePopupModule } from 'components';
const uiModules = [
  DraggablePopupModule
];
//#endregion

import { AppComponent } from './app.component';

@NgModule({
  //#region ng module options
  declarations: [
    AppComponent
  ],
  imports: [
    ...angularModules,
    ...angularMaterial,
    ...uiModules,
  ],
  exports: [
    ...uiModules,
  ],
  providers: [],
  bootstrap: [AppComponent]
  //#endregion
})
export class AppModule { }
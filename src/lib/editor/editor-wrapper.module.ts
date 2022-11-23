//#region @browser
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorWrapperComponent } from './editor-wrapper.component';

// formly
import { FormlyModule } from '@ngx-formly/core';
// import { FormlyMaterialModule, } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
// other
import { NgxWigModule } from 'ngx-wig';
import { CLASS } from 'typescript-class-helpers';


export const FormlyModuleMod = FormlyModule.forRoot({
  types: [
    { name: 'texteditor', component: EditorWrapperComponent },
    { name: CLASS.getName(EditorWrapperComponent), component: EditorWrapperComponent }
  ]
});

const formlyModules = [
  // FormlyMaterialModule,
  FormlyModuleMod,
  FormlyMatToggleModule,
  FormlyMatDatepickerModule,
  MatNativeDateModule,
  FormlyMatSliderModule
];

const otherModules = [
  NgxWigModule
];

@NgModule({
  imports: [
    CommonModule,
    ...formlyModules,
    ...otherModules
  ],
  exports: [
    EditorWrapperComponent
  ],
  declarations: [EditorWrapperComponent]
})
export class EditorWrapperModule { }
//#endregion

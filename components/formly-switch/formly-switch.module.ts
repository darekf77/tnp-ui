import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// formlu
import { FormlySwitchComponent } from './formly-switch.component';
import { FormlyModule } from '@ngx-formly/core';
// import { FormlyMaterialModule, } from '@ngx-formly/material';
// material
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CLASS } from 'typescript-class-helpers';

const angularModules = [
  CommonModule,
  ReactiveFormsModule
]

const formlyModules = [
  // FormlyMaterialModule,
];

const materialModules = [
  MatSlideToggleModule
]

export const FromlModuleMode = FormlyModule.forRoot({
  types: [
    { name: 'switch', component: FormlySwitchComponent },
    { name: CLASS.getName(FormlySwitchComponent), component: FormlySwitchComponent }
  ]
});


@NgModule({
  imports: [
    ...angularModules,
    ...formlyModules,
    ...materialModules,
    FromlModuleMode,
  ],
  exports: [
    FormlySwitchComponent,
  ],
  declarations: [FormlySwitchComponent]
})
export class FormlySwitchModule { }
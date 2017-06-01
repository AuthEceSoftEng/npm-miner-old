import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MdToolbarModule, MdButtonModule, MdCheckboxModule, MdGridListModule, MdIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule, MdCheckboxModule, MdGridListModule,MdToolbarModule, MdIconModule
  ],
  exports: [MdButtonModule, MdCheckboxModule, MdGridListModule, MdToolbarModule, MdIconModule],
  declarations: []
})
export class CustomMaterialModule { }

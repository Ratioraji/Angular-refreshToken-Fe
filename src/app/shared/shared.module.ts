import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';


const MODULES = [CommonModule, RouterModule];

@NgModule({
  imports: [...MODULES],
  declarations: [],
  exports: [...MODULES],
})
export class SharedModule {}

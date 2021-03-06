import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule,
    MainRoutingModule,
    SharedModule
  ],
  providers: [],
})
export class MainModule { }

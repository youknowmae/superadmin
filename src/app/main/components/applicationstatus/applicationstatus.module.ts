import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationstatusRoutingModule } from './applicationstatus-routing.module';
import { ApplicationstatusComponent } from './applicationstatus.component';
import { ViewComponent } from './components/view/view.component';

import { ListComponent } from './components/list/list.component';


@NgModule({
  declarations: [
    // ApplicationstatusComponent

    ViewComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    ApplicationstatusRoutingModule
  ]
})
export class ApplicationstatusModule { }

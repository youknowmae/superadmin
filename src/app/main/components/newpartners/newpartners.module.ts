import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewpartnersRoutingModule } from './newpartners-routing.module';
import { NewpartnersComponent } from './newpartners.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    NewpartnersRoutingModule
  ]
})
export class NewpartnersModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewpartnersRoutingModule } from './newpartners-routing.module';
import { NewpartnersComponent } from './newpartners.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    NewpartnersRoutingModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class NewpartnersModule { }
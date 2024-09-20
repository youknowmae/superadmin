import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { IndustrypartnersComponent } from './industrypartners.component';
import { ApplyComponent } from './components/apply/apply.component';
import { ViewComponent } from './components/view/view.component';
import { ListComponent } from './components/list/list.component';
import { MaterialsModules } from '../../../modules/materials.module';


@NgModule({
  declarations: [
    // IndustrypartnersComponent

    ApplyComponent,
    ViewComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    IndustrypartnersRoutingModule,
    MaterialsModules
  ]
})
export class IndustrypartnersModule { }

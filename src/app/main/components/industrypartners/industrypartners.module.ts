import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { IndustrypartnersComponent } from './industrypartners.component';
import { ApplyComponent } from './components/apply/apply.component';
import { ViewComponent } from './components/view/view.component';
import { ListComponent } from './components/list/list.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { EditIndustryPartnerComponent } from './components/edit-industry-partner/edit-industry-partner.component';
import { AddIndustryPartnerComponent } from './components/add-industry-partner/add-industry-partner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../components/login/loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    // IndustrypartnersComponent

    ApplyComponent,
    ViewComponent,
    ListComponent,
    EditIndustryPartnerComponent,
    AddIndustryPartnerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IndustrypartnersRoutingModule,
    MaterialsModules,
    LoadingSpinnerComponent
  ]
})
export class IndustrypartnersModule { }

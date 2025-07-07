import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { ViewComponent } from './components/view/view.component';
import { ListComponent } from './components/list/list.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { EditIndustryPartnerComponent } from './components/edit-industry-partner/edit-industry-partner.component';
import { AddIndustryPartnerComponent } from './components/add-industry-partner/add-industry-partner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../components/login/loading-spinner/loading-spinner.component';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';

@NgModule({
  declarations: [
    ViewComponent,
    ListComponent,
    EditIndustryPartnerComponent,
    AddIndustryPartnerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IndustrypartnersRoutingModule,
    MaterialsModules,
    LoadingSpinnerComponent,
    DragScrollComponent,
    DragScrollItemDirective,
  ],
})
export class IndustrypartnersModule {}

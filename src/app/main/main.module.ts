import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { IndustrypartnersModule } from './components/industrypartners/industrypartners.module';

import { MaterialsModules } from '../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component';
import { StudentsModule } from './components/students/students.module';
import { SettingsComponent } from './components/settings/settings.component';
import { NewpartnersModule } from './components/newpartners/newpartners.module';
import { NewpartnersComponent } from './components/newpartners/newpartners.component';
import { LoadingSpinnerComponent } from '../components/login/loading-spinner/loading-spinner.component';

import { SharedModule } from '../modules/shared.module';
import { TechnicalskillsComponent } from './components/technicalskills/technicalskills.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { TemplatesModule } from './components/templates/templates.module';

@NgModule({
  declarations: [
    IndustrypartnersComponent,
    DashboardComponent,
    StudentsComponent,
    SettingsComponent,
    NewpartnersComponent,
    TechnicalskillsComponent,
    TemplatesComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    IndustrypartnersModule,
    StudentsModule,
    NewpartnersModule,
    MaterialsModules,
    LoadingSpinnerComponent,
    SharedModule,
    TemplatesModule
  ],
})
export class MainModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { IndustrypartnersModule } from './components/industrypartners/industrypartners.module';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MaterialsModules } from '../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component';
import { StudentsModule } from './components/students/students.module';
import { SettingsComponent } from './components/settings/settings.component';
import { NewpartnersModule } from './components/newpartners/newpartners.module';
import { NewpartnersComponent } from './components/newpartners/newpartners.component';

@NgModule({
  declarations: [
    IndustrypartnersComponent,
    DashboardComponent,
    StudentsComponent,
    SettingsComponent,
    NewpartnersComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    IndustrypartnersModule,
    StudentsModule,
    NewpartnersModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    MaterialsModules
  ],
})
export class MainModule { }

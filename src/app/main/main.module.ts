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

@NgModule({
  declarations: [
    IndustrypartnersComponent,
    DashboardComponent,
    StudentsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    IndustrypartnersModule,
    StudentsModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    MaterialsModules
  ],
})
export class MainModule { }

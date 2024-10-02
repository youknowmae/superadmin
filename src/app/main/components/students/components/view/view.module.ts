import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { StudentprofileComponent } from './components/studentprofile/studentprofile.component';
import { AttendanceformComponent } from './components/attendanceform/attendanceform.component';
import { AccomplishmentreportComponent } from './components/accomplishmentreport/accomplishmentreport.component';
import { MaterialsModules } from '../../../../../modules/materials.module';


@NgModule({
  declarations: [
    StudentprofileComponent,
    AttendanceformComponent,
    AccomplishmentreportComponent,
  ],
  imports: [
    CommonModule,
    MaterialsModules,
    ViewRoutingModule
  ]
})
export class ViewModule { }

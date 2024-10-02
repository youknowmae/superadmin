import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceformComponent } from './components/attendanceform/attendanceform.component';
import { AccomplishmentreportComponent } from './components/accomplishmentreport/accomplishmentreport.component';
import { StudentprofileComponent } from './components/studentprofile/studentprofile.component';

const routes: Routes = [
  { path: '', redirectTo: 'studentprofile', pathMatch: 'full' },
  { path: 'attendanceform', component: AttendanceformComponent },
  { path: 'accomplishmentreport', component: AccomplishmentreportComponent },
  { path: 'studentprofile', component: StudentprofileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }

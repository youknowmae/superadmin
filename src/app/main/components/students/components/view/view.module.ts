import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { StudentprofileComponent } from './components/studentprofile/studentprofile.component';
import { AttendanceformComponent } from './components/attendanceform/attendanceform.component';
import { AccomplishmentreportComponent } from './components/accomplishmentreport/accomplishmentreport.component';
import { MaterialsModules } from '../../../../../modules/materials.module';
import { LoadingSpinnerComponent } from '../../../../../components/login/loading-spinner/loading-spinner.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExitPollComponent } from './components/exit-poll/exit-poll.component';
import { SharedModule } from '../../../../../modules/shared.module';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';

@NgModule({
  declarations: [
    StudentprofileComponent,
    AttendanceformComponent,
    AccomplishmentreportComponent,
    EvaluationComponent,
    ExitPollComponent,
  ],
  imports: [
    CommonModule,
    MaterialsModules,
    ViewRoutingModule,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    SharedModule,
    DragScrollComponent,
    DragScrollItemDirective,
  ],
})
export class ViewModule {}

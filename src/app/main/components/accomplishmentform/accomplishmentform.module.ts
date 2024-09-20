import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AccomplishmentformRoutingModule } from './accomplishmentform-routing.module';
import { AccomplishmentformComponent } from './accomplishmentform.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddattendanceComponent } from './components/addattendance/addattendance.component';
import { AddaccomplishmentComponent } from './components/addaccomplishment/addaccomplishment.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AccomplishmentformComponent,
    AddattendanceComponent,
    AddaccomplishmentComponent
  ],
  imports: [
    CommonModule,
    // AccomplishmentformRoutingModule,
    MaterialsModules,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccomplishmentformModule { }

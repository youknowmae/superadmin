import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ViewComponent } from './components/view/view.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    MaterialsModules,
    ReactiveFormsModule,
    MatDialogModule,
    NgxDocViewerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnnouncementModule { }

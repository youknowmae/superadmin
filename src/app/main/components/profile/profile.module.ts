import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AddseminarComponent } from './components/addseminar/addseminar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MaterialsModules } from '../../../modules/materials.module';
import { ViewImageComponent } from './components/view-image/view-image.component';




@NgModule({
  exports:[
    MatDialogModule
  ],

  declarations: [
    // ProfileComponent
    AddseminarComponent,
    ViewImageComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,  // For reactive forms (FormGroup, FormControl)
    MaterialsModules
  ]
})
export class ProfileModule { }

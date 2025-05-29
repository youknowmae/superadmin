import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialsModules } from '../../../modules/materials.module';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';

@NgModule({
  declarations: [ 
    AddTemplateComponent, 
    EditTemplateComponent, 
  ],
  imports: [
    CommonModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class TemplatesModule { }

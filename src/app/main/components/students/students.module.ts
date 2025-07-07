import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { ViewModule } from './components/view/view.module';
import { SharedModule } from '../../../modules/shared.module';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';


@NgModule({
  declarations: [  
    ListComponent, 
    ViewComponent,
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    MaterialsModules,
    ViewModule,
    SharedModule,
    DragScrollComponent,
    DragScrollItemDirective,
  ]
})
export class StudentsModule { }

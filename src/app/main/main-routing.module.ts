import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsComponent } from './components/students/students.component';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NewpartnersComponent } from './components/newpartners/newpartners.component';
import { TechnicalskillsComponent } from './components/technicalskills/technicalskills.component';



const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'technicalskills', component: TechnicalskillsComponent },
  { 
    path: 'newpartners', 
    component: NewpartnersComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/newpartners/newpartners.module').then((m)=>m.NewpartnersModule)
    }]
  },
  { 
    path: 'students', 
    component: StudentsComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/students/students.module').then((m)=>m.StudentsModule)
    }]
  },
  { 
    path: 'industrypartners', 
    component: IndustrypartnersComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/industrypartners/industrypartners.module').then((m)=>m.IndustrypartnersModule)
    }]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

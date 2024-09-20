import { AnnouncementComponent } from './components/announcement/announcement.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccomplishmentformComponent } from './components/accomplishmentform/accomplishmentform.component';
import { ApplicationstatusComponent } from './components/applicationstatus/applicationstatus.component';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { MapComponent } from './components/map/map.component';
import { OjtexitpollComponent } from './components/ojtexitpoll/ojtexitpoll.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FiletemplateComponent } from './components/filetemplate/filetemplate.component';



const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'accomplishmentform',
    component: AccomplishmentformComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/accomplishmentform/accomplishmentform.module').then((m)=>m.AccomplishmentformModule)
    }]
  },
  {
    path: 'applicationstatus',
    component: ApplicationstatusComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/applicationstatus/applicationstatus.module').then((m)=>m.ApplicationstatusModule)
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
  {
    path: 'map',
    component: MapComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/map/map.module').then((m)=>m.MapModule)
    }]
  },
  {
    path: 'ojtexitpoll',
    component: OjtexitpollComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/profile/profile.module').then((m)=>m.ProfileModule)
    }]
  },
  { path: 'announcements', component: AnnouncementComponent },
  { path: 'templates', component: FiletemplateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

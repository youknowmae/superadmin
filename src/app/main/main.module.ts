import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ApplicationstatusComponent } from './components/applicationstatus/applicationstatus.component';
import { MapComponent } from './components/map/map.component';
import { OjtexitpollComponent } from './components/ojtexitpoll/ojtexitpoll.component';
import { AccomplishmentformModule } from './components/accomplishmentform/accomplishmentform.module';
import { ApplicationstatusModule } from './components/applicationstatus/applicationstatus.module';
import { IndustrypartnersModule } from './components/industrypartners/industrypartners.module';
import { MapModule } from './components/map/map.module';
import { ProfileModule } from './components/profile/profile.module';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { FiletemplateComponent } from './components/filetemplate/filetemplate.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MaterialsModules } from '../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AnnouncementModule } from './components/announcement/announcement.module';

@NgModule({
  declarations: [
    IndustrypartnersComponent,
    ProfileComponent,
    ApplicationstatusComponent,
    MapComponent,
    OjtexitpollComponent,
    AnnouncementComponent,
    FiletemplateComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    AccomplishmentformModule,
    ApplicationstatusModule,
    AnnouncementModule,
    IndustrypartnersModule,
    MapModule,
    ProfileModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    MaterialsModules
  ],
})
export class MainModule { }

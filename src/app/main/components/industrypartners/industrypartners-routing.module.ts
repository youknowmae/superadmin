import { ListComponent } from './components/list/list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustrypartnersComponent } from './industrypartners.component';
import { ViewComponent } from './components/view/view.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'view', component: ViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustrypartnersRoutingModule { }

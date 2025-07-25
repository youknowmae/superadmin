import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'main', 
    component: MainComponent, 
    canActivateChild: [AuthGuard],
    children: [{ 
      path: '', 
      loadChildren: ()=> import('./main/main.module'). then((m)=>m.MainModule)
    }]
  },
  { path: 'newpartners', loadChildren: () => import('./main/components/newpartners/newpartners.module').then(m => m.NewpartnersModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

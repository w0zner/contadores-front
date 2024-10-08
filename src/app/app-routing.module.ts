import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PagesRoutingModule } from './pages/pages.routing';

const routes: Routes = [
  { path:'login', component:LoginComponent },
  { path:'', redirectTo:'/login', pathMatch:'full' },
  {path:'registro', component: RegistroComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

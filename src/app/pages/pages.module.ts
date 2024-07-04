import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages.routing';
import { PerfilComponent } from './perfil/perfil.component';



@NgModule({
  declarations: [PagesComponent, PerfilComponent],
  imports: [
    CommonModule,
    RouterModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PagesComponent, PerfilComponent
  ]
})
export class PagesModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { authGuard } from '../guards/auth.guard';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoDocumentoComponent } from './nuevo-documento/nuevo-documento.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { ArchivosComponent } from './archivos/archivos.component';
import { MisDocumentosComponent } from './mis-documentos/mis-documentos.component';
import { EmptyComponent } from './empty/empty.component';
import { adminGuard } from '../guards/admin.guard';


const routes: Routes = [
  {path: 'dashboard', component: PagesComponent, canActivate: [authGuard],
    children: [
      {path: 'perfil', component: PerfilComponent},

      //Rutas admin
      {path: 'usuarios', component:UsuariosComponent, canActivate: [adminGuard]},
      {path: 'nuevo-documento', component:NuevoDocumentoComponent, canActivate: [adminGuard]},
      {path: 'documentos', component:DocumentosComponent, canActivate: [adminGuard]},
      {path: 'documentos/:id', component:ArchivosComponent},
      {path: 'documentos/mis-documentos/:id', component:MisDocumentosComponent},
      {path: 'temporary-route', component: EmptyComponent}  // Ruta temporal
    ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

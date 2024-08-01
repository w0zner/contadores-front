import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages.routing';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoDocumentoComponent } from './nuevo-documento/nuevo-documento.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { ArchivosComponent } from './archivos/archivos.component';
import { MisDocumentosComponent } from './mis-documentos/mis-documentos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmptyComponent } from './empty/empty.component';



@NgModule({
  declarations: [PagesComponent, PerfilComponent, UsuariosComponent, NuevoDocumentoComponent, DocumentosComponent, ArchivosComponent, MisDocumentosComponent, EmptyComponent],
  imports: [
    CommonModule,
    RouterModule,
    PagesRoutingModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  exports: [
    PagesComponent, PerfilComponent, UsuariosComponent, NuevoDocumentoComponent, DocumentosComponent, ArchivosComponent, MisDocumentosComponent
  ]
})
export class PagesModule { }

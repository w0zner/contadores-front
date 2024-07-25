import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  public usuarioLogueado: any

  menu: any[] = [
    {
      titulo: 'Perfil',
      icono: 'mdi-home',
      url: '/dashboard/perfil'
    },
    {
      titulo: 'Usuarios',
      icono: 'mdi-account-multiple',
      url: '/dashboard/usuarios'
    },
    {
      titulo: 'Nuevo Documento',
      icono: 'mdi-file',
      url: '/dashboard/nuevo-documento'
    },
    {
      titulo: 'Documentos Generales',
      icono: 'mdi-folder-lock-open',
      url: '/dashboard/documentos'
    },
    {
      titulo: 'Mis Documentos',
      icono: 'mdi-cloud-download',
      url: '/dashboard/documentos/mis-documentos/123'
    },
  ]

  constructor(private router: Router, private usuarioService: UsuarioService) {
    this.usuarioLogueado = this.usuarioService.usuario

  }

  ngOnInit() {

  }

  logout() {
    this.usuarioService.logout()
    this.router.navigateByUrl('/login')
  }


}

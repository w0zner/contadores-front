import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  public usuarioLogueado: any
  public menu: any[] = []
  /*
  menu: any[] = [
    {
      titulo: 'Perfil',
      icono: 'mdi mdi-home',
      url: '/dashboard/perfil'
    },
    {
      titulo: 'Usuarios',
      icono: 'mdi mdi-account-multiple',
      url: '/dashboard/usuarios'
    },
    {
      titulo: 'Nuevo Documento',
      icono: 'mdi mdi-file',
      url: '/dashboard/nuevo-documento'
    },
    {
      titulo: 'Documentos Generales',
      icono: 'mdi mdi-folder-lock-open',
      url: '/dashboard/documentos'
    },
    {
      titulo: 'Mis Documentos',
      icono: 'mdi mdi-cloud-download',
      url: '/dashboard/documentos/mis-documentos/123'
    },
  ]
*/

  constructor(private router: Router, private usuarioService: UsuarioService, public menuService: MenuService) {
    this.usuarioLogueado = this.usuarioService.usuario

  }

  ngOnInit() {
    this.menu = this.menuService.cargarMenu()
    console.log( this.menu)
  }

  logout() {
    this.usuarioService.logout()
    this.router.navigateByUrl('/login')
  }


}

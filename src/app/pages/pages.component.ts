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

  constructor(private router: Router, private usuarioService: UsuarioService, public menuService: MenuService) {
    this.usuarioLogueado = this.usuarioService.usuario
  }

  ngOnInit() {
    this.menu = this.menuService.cargarMenu()
  }

  logout() {
    this.usuarioService.logout()
    this.router.navigateByUrl('/login')
  }


}

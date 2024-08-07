import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  public usuarioLogueado: any
  public menu: any[] = []

  constructor(private router: Router, private authService: AuthService,  public menuService: MenuService) { }

  ngOnInit() {
    this.usuarioLogueado = this.authService.usuario
    this.menu = this.menuService.cargarMenu()
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/login')
  }


}

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

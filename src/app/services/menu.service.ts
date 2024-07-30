import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  //public menu: any[] = []

  constructor(private usuarioService: UsuarioService) { }

  cargarMenu(): any {
    const usuarioLogueado = this.usuarioService.getUserLogged()
    const menuBackend = JSON.parse(localStorage.getItem('menu') ?? '') || []

    let menu = menuBackend.map((item: any) => {
      console.log("ITEM ", item)
      if(item.titulo === 'Mis Documentos') {
        return {
          ...item,
          url: '/dashboard/documentos/mis-documentos/' + usuarioLogueado
        };
      }
      return item
    })
    console.log("MENUS ", menu)
    return menu
  }
}

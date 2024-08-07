import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private localStorageService: LocalStorageService) { }

  cargarMenu(): any {
    const usuarioLogueado = this.localStorageService.getItem('user', false)
    const menuBackend = this.localStorageService.getItem('menu', true)

    let menu = menuBackend.map((item: any) => {
      if(item.titulo === 'Mis Documentos') {
        return {
          ...item,
          url: '/dashboard/documentos/mis-documentos/' + usuarioLogueado
        };
      }
      return item
    })
    return menu
  }
}

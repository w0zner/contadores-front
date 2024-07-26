import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  //public menu: any[] = []

  constructor() { }

  cargarMenu(): any {
    const menu = JSON.parse(localStorage.getItem('menu') ?? '') || []
    return menu
  }
}

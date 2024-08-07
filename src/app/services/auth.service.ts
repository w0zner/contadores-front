import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { HeaderService } from './header.service';
import { Login } from '../interfaces/login.interface';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Usuarios } from '../models/usuarios.model';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuario: any

  constructor(private  http: HttpClient, private localStorageService: LocalStorageService, private headerService: HeaderService) { }

  login(data: Login) {
    return this.http.post(`${base_url}/login/`, data).pipe(
      tap(
        (response: any) => {
          this.localStorageService.setItem('token', response.token, false)
          this.localStorageService.setItem('menu', response.menu, true)

          this.headerService.updateHeaders();
        }
      )
    )
  }

  refreshToken():Observable<boolean> {
    return this.http.get(`${base_url}/login/refreshToken`,
        { headers: this.headerService.headers }).pipe(
        map((resp: any) => {
          const {nombre, email, curp, telefono, estado, password, password2, role, uid} = resp.usuario

          this.localStorageService.setItem('token', resp.token, false)
          this.localStorageService.setItem('menu', resp.menu, true)
          this.localStorageService.setItem('user', uid, false)

          this.headerService.updateHeaders();

          this.usuario = new Usuarios(nombre, email, curp, telefono, estado, '', '', role, uid)

          return true
        }),
        catchError(error => of(false)))
  }

  logout() {
    this.localStorageService.clear()
  }
}

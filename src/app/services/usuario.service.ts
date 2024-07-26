import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Registro } from '../interfaces/registro.interface';
import { Login } from '../interfaces/login.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Usuarios } from '../models/usuarios.model';

const url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: any

  constructor(private  http: HttpClient) { }

  crearUsuario(data: Registro){
    return this.http.post(`${url}/usuarios/`, data)
  }

  login(data: Login) {
    return this.http.post(`${url}/login/`, data).pipe(
      tap(
        (response: any) => {
          this.almacenarLocalStorage(response.token, response.menu)
        }
      )
    )
  }

  logout() {
    localStorage.removeItem('token')
  }

  refreshToken():Observable<boolean> {
    return this.http.get(`${url}/login/refreshToken`,
      {headers: {'x-token': this.getToken()}}).pipe(
        map((resp: any) => {
          const {nombre, email, curp, telefono, password, password2, role, uid} = resp.usuario

          this.almacenarLocalStorage(resp.token, resp.menu)

          this.usuario = new Usuarios(nombre, email, curp, telefono, '', '', role, uid)
          console.log("Desde refresh ",this.usuario)

          return true
        }),
        catchError(error => of(false)))
  }

  almacenarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token)
    localStorage.setItem('menu', JSON.stringify(menu))
  }

  getToken():string {
    return localStorage.getItem('token') || ''
  }

  getMenu():any {
    return localStorage.getItem('menu') || ''
  }

  getheaders() {
    return {
      headers: { 'x-token': this.getToken() }
    }
  }

  actualizarUsuario(id: string, data: {nombre: string, email: string, curp: string, telefono: string, role: 'ADMIN_ROLE' | 'USER_ROLE'}) {
    return this.http.put(`${url}/usuarios/${id}`, data, this.getheaders())
  }
}

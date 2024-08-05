import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Registro } from '../interfaces/registro.interface';
import { Login } from '../interfaces/login.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Usuarios } from '../models/usuarios.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';
import { CargarUsuario } from '../interfaces/cargar-usuario.interface';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: any

  constructor(private  http: HttpClient) { }

  crearUsuario(data: Registro){
    return this.http.post(`${base_url}/usuarios/`, data)
  }

  login(data: Login) {
    return this.http.post(`${base_url}/login/`, data).pipe(
      tap(
        (response: any) => {
          this.almacenarLocalStorage(response.token, response.menu)
        }
      )
    )
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('menu')
    localStorage.removeItem('user')
  }

  refreshToken():Observable<boolean> {
    return this.http.get(`${base_url}/login/refreshToken`,
      {headers: {'x-token': this.getToken()}}).pipe(
        map((resp: any) => {
          const {nombre, email, curp, telefono, estado, password, password2, role, uid} = resp.usuario

          this.almacenarLocalStorage(resp.token, resp.menu, uid)

          this.usuario = new Usuarios(nombre, email, curp, telefono, estado, '', '', role, uid)

          return true
        }),
        catchError(error => of(false)))
  }

  almacenarLocalStorage(token: string, menu: any, userId?: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('menu', JSON.stringify(menu))
    localStorage.setItem('user', userId || '')
  }

  getToken():string {
    return localStorage.getItem('token') || ''
  }

  getMenu():any {
    return localStorage.getItem('menu') || ''
  }

  getUserLogged():string {
    return localStorage.getItem('user') || ''
  }

  getheaders() {
    return {
      headers: { 'x-token': this.getToken() }
    }
  }

  actualizarUsuario(id: string, data: {nombre: string, email: string, curp: string, telefono: string, estado: boolean, role: 'ADMIN_ROLE' | 'USER_ROLE'}) {
    return this.http.put(`${base_url}/usuarios/${id}`, data, this.getheaders())
  }

  cargarUsuarios() {
    return this.http.get<CargarUsuarios>(`${base_url}/usuarios/`, this.getheaders())
        .pipe(
          map((resp) => {
            const usuarios = resp.usuarios.map(user => new Usuarios(user.nombre, user.email, user.curp, user.telefono, user.estado, '', '', user.role, user.uid))
            console.log(resp)
            return usuarios
          })
        )
  }

  updateUser(usuario: Usuarios) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.getheaders())
  }

  deleteUser(id: string) {
    return this.http.delete(`${base_url}/usuarios/${id}`, this.getheaders())
  }

  getUsuario(id: string) {
    return this.http.get<{ ok: boolean, usuario: any }>(`${base_url}/usuarios/${id}`, this.getheaders())
        .pipe(
          map(resp => {
            if (resp.ok) {
              const usuario = new Usuarios(resp.usuario?.nombre, resp.usuario?.email, resp.usuario?.curp, resp.usuario?.telefono, resp.usuario?.estado, '', '', resp.usuario?.role, resp.usuario?.uid);
              return usuario
            } else {
              throw new Error('Error al obtener usuario');
            }
          })
        )
  }

}

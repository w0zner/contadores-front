import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Registro } from '../interfaces/registro.interface';
import { Usuarios } from '../models/usuarios.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';
import { HeaderService } from './header.service';
import { map } from 'rxjs';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private  http: HttpClient,  private headerService: HeaderService) { }

  cargarUsuarios() {
    return this.http.get<CargarUsuarios>(`${base_url}/usuarios/`, { headers: this.headerService.headers })
        .pipe(
          map((resp) => {
            const usuarios = resp.usuarios.map(user => new Usuarios(user.nombre, user.email, user.curp, user.telefono, user.estado, '', '', user.role, user.uid))
            console.log(resp)
            return usuarios
          })
        )
  }

  obtenerUsuarioPorId(id: string) {
    return this.http.get<{ ok: boolean, usuario: any }>(`${base_url}/usuarios/${id}`, { headers: this.headerService.headers })
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

  crearUsuario(data: Registro){
    return this.http.post(`${base_url}/usuarios/`, data)
  }

  actualizarUsuario(id: string, data: {nombre: string, email: string, curp: string, telefono: string, estado: boolean, role: 'ADMIN_ROLE' | 'USER_ROLE'}) {
    return this.http.put(`${base_url}/usuarios/${id}`, data, { headers: this.headerService.headers })
  }

  updateUser(usuario: Usuarios) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, { headers: this.headerService.headers })
  }

  eliminarUsuario(id: string) {
    return this.http.delete(`${base_url}/usuarios/${id}`, { headers: this.headerService.headers })
  }
}

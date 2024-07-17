import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Registro } from '../interfaces/registro.interface';
import { Login } from '../interfaces/login.interface';
import { tap } from 'rxjs';

const url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private  http: HttpClient) { }

  crearUsuario(data: Registro){
    return this.http.post(`${url}/usuarios/`, data)
  }

  login(data: Login) {
    return this.http.post(`${url}/login/`, data).pipe(
      tap(
        (response: any) => {
          this.almacenarLocalStorage(response.token)
        }
      )
    )
  }

  logout() {
    localStorage.removeItem('token')
  }

  almacenarLocalStorage(token: string) {
    localStorage.setItem('token', token)
  }
}

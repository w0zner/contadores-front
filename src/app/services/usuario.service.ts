import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Registro } from '../interfaces/registro.interface';

const url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private  http: HttpClient) { }

  crearUsuario(data: Registro){
    console.log(data)
  }
}

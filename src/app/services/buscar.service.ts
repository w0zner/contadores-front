import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuarios } from '../models/usuarios.model';
import { Documentos } from '../models/documentos.model';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class BuscarService {

  constructor(private http: HttpClient) { }

  getToken():string {
    return localStorage.getItem('token') || ''
  }

  getheaders() {
    return {
      headers: { 'x-token': this.getToken() }
    }
  }

  buscarTermino(tabla: 'usuarios' | 'documentos', termino: string){
    return this.http.get(`${base_url}/buscar/coleccion/${tabla}/${termino}`, this.getheaders())
      .pipe(
        map((resp: any) => {
          switch(tabla) {
            case 'usuarios':
              return this.obtenerUsuarios(resp.resultado)
            case 'documentos':
              return this.obtenerDocumentos(resp.resultado)
            default:
              return []
          }
        })
      )
  }

  private obtenerUsuarios(resultados: any[]): Usuarios[] {
    return resultados.map(
      user => new Usuarios(user.nombre, user.email, user.curp, user.telefono, '', '', user.role, user.uid)
    )
  }

  private obtenerDocumentos(resultados: any[]): Documentos[] {
    return resultados.map(
      doc => new Documentos(doc.nombre, doc.usuario, doc.fecha, doc.pdf, doc._id)
    )
  }
}

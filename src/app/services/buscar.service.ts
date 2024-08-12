import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuarios } from '../models/usuarios.model';
import { Documentos } from '../models/documentos.model';
import { HeaderService } from './header.service';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class BuscarService {

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  buscarTermino(tabla: 'usuarios' | 'documentos', termino: string){
    return this.http.get(`${base_url}/buscar/coleccion/${tabla}/${termino}`, { headers: this.headerService.headers })
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
      user => new Usuarios(user.nombre, user.email, user.curp, user.telefono, user.estado, '', '', user.role, user.uid)
    )
  }

  private obtenerDocumentos(resultados: any[]): Documentos[] {
    return resultados.map(
      doc => new Documentos(doc.nombre, doc.estado, doc.tipo, doc.usuarioCreacion, doc.usuario, doc.fecha, doc.pdf, doc._id)
    )
  }
}

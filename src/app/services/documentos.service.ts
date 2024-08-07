import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Documentos } from '../models/documentos.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { CargarDocumentos } from '../interfaces/cargar-documentos.interface';
import { HeaderService } from './header.service';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private url = `${base_url}/documentos`
  documento: Documentos | undefined

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  cargarMisDocumentos(id: string) {
    return this.http.get<CargarDocumentos>(`${this.url}/mis-documentos/${id}`, { headers: this.headerService.headers })
    .pipe(
      map((resp) => {
        const documentos = resp.documentos
            .map(doc => new Documentos(doc.nombre, doc.estado, doc.tipo, doc.usuarioCreacion, doc.observacion, doc.usuario, doc.fecha, doc.pdf, doc._id))
            console.log("DOCUMENRT ", resp )
        return documentos
      })
    )
  }

  cargarDocumentosGenerales() {
    return this.http.get<CargarDocumentos>(this.url, { headers: this.headerService.headers })
      .pipe(
        map((resp)=> {
          const documentos = resp.documentos.map(doc => new Documentos(doc.nombre, doc.estado, doc.tipo, doc.usuarioCreacion, doc.observacion, doc.usuario, doc.fecha, doc.pdf, doc._id))
          console.log("DOCUMENTG ", resp )
          return documentos
        })
      )
  }

  obtenerDocumentoPorId(id: string) {
    const url = `${this.url}/editar-documento/${id}`
    return this.http.get(url, { headers: this.headerService.headers })
      .pipe(
        map((resp:any) => {
          const documento = resp.documento as Documentos
          return documento
        })
      )
  }

  crearDocumento(data: Documentos) {
    return this.http.post(this.url, data, { headers: this.headerService.headers })
  }

  editarDocumento(datos: Documentos) {
    const url = `${this.url}/editar-documento/${datos._id}`
    return this.http.put(url, datos, { headers: this.headerService.headers })
      .pipe(
        map((resp:any) => resp.documento)
      )
  }

  eliminarDocumento(id: string){
    return this.http.delete(`${this.url}/${id}`, { headers: this.headerService.headers })
  }
}

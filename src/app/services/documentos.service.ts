import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Documentos } from '../models/documentos.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { CargarDocumentos } from '../interfaces/cargar-documentos.interface';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  documento: Documentos | undefined

  constructor(private http: HttpClient) { }

  getToken():string {
    return localStorage.getItem('token') || ''
  }

  getheaders() {
    return {
      headers: { 'x-token': this.getToken() }
    }
  }

  getId(){
    return this.documento?._id
  }

  cargarMisDocumentos(id: string) {
    const url = `${base_url}/documentos/mis-documentos`
    return this.http.get<CargarDocumentos>(`${url}/${id}`, this.getheaders())
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
    const url = `${base_url}/documentos/`
    return this.http.get<CargarDocumentos>(url, this.getheaders())
      .pipe(
        map((resp)=> {
          const documentos = resp.documentos.map(doc => new Documentos(doc.nombre, doc.estado, doc.tipo, doc.usuarioCreacion, doc.observacion, doc.usuario, doc.fecha, doc.pdf, doc._id))
          console.log("DOCUMENTG ", resp )
          return documentos
        })
      )
  }

  crearDocumento(data: Documentos) {
    const url = `${base_url}/documentos/`
    return this.http.post(url, data, this.getheaders())
  }

  eliminarDocumento(id: string){
    const url = `${base_url}/documentos/${id}`
    return this.http.delete(url, this.getheaders())
  }

  getDocumentoByID(id: string) {
    const url = `${base_url}/documentos/editar-documento/${id}`
    return this.http.get(url, this.getheaders())
      .pipe(
        map((resp:any) => {
          const documento = resp.documento as Documentos
          return documento
        })
      )
  }

  editarDocumento(datos: Documentos) {
    const url = `${base_url}/documentos/editar-documento/${datos._id}`
    return this.http.put(url, datos, this.getheaders())
      .pipe(
        map((resp:any) => resp.documento)
      )
  }

}

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
            .map(doc => new Documentos(doc.nombre, doc.usuario, doc.fecha, doc.pdf, doc._id))
        return documentos
      })
    )
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  async subirArchivo(archivo: File, tabla: 'usuarios' | 'documentos', id: string) {
    const url = `${base_url}/upload/${tabla}/${id}`
    try {
      const formData = new FormData()
      formData.append('pdf', archivo)

      const resp = await fetch(url, {
        method: 'PUT',
        headers: { 'x-token': this.localStorageService.getItem('token', false) },
        body: formData
      })

      const data = await resp.json()

      return data

    } catch (error) {
      return false
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.url_raiz

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(private http: HttpClient) { }

  getToken():string {
    return localStorage.getItem('token') || ''
  }

  getheaders() {
    return {
      headers: { 'x-token': this.getToken() }
    }
  }

  async subirArchivo(archivo: File, tabla: 'usuarios' | 'documentos', id: string) {
    const url = `${base_url}/upload/${tabla}/${id}`
    try {
      const formData = new FormData()
      formData.append('pdf', archivo)

      const resp = await fetch(url, {
        method: 'PUT',
        headers: { 'x-token': this.getToken() },
        body: formData
      })

      const data = await resp.json()

      return data

    } catch (error) {
      console.log(error)
      return false
    }
  }
}

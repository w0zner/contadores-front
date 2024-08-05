import { environment } from "src/environments/environment"

const base_url = environment.url_raiz
export class Documentos {

    constructor(
      public nombre: string,
      public estado: 'INCOMPLETO' | 'PENDIENTE' | 'LISTO' | 'RECHAZADO',
      public tipo: 'FACTURA' | 'INFORME',
      public usuarioCreacion?: any,
      public usuario?: any,
      public fecha?: string,
      public pdf?: string,
      public _id?: string
    ){}

    documentoURL() {
      if(!this.pdf) {
        return ''
      } else if(this.pdf.includes('https')) {
        return this.pdf
      } else if(this.pdf) {
        return `${base_url}/upload/documentos/${this.pdf}`
      } else {
        return;
      }
    }
  }

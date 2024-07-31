import { Component, OnInit } from '@angular/core';
import { Documentos } from 'src/app/models/documentos.model';
import { BuscarService } from 'src/app/services/buscar.service';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  public documentos: Documentos[] = []

  p: number = 1;


  constructor(private buscarService: BuscarService, private documentosService: DocumentosService) {

  }

  ngOnInit(): void {
    this.documentosService.cargarDocumentosGenerales().subscribe({
      next: (resp) => {
        console.log("Documentos Generales ", resp)
      }
    })
  }

  cargarDocumentos(){
   
  }

  buscar(termino: string) {
    if(termino.length > 0) {
      this.buscarService.buscarTermino('documentos', termino).subscribe({
        next: (resp: any[]) => {
          console.log("BUSCANDO ",resp)
          this.documentos = resp
        }
      })
    } else {
      this.cargarDocumentos()
    }
  }

  editarDocumento(id: string){

  }

  actualizarDocumento() {

  }

  eliminarDocumento() {

  }
}

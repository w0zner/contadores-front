import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Documentos } from 'src/app/models/documentos.model';
import { BuscarService } from 'src/app/services/buscar.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  public actualizacionDocumentoForm: FormGroup
  public documentos: Documentos[] = []
  public documento: any

  p: number = 1;

  constructor(private buscarService: BuscarService, private documentosService: DocumentosService, private fb: FormBuilder) {
    this.actualizacionDocumentoForm = fb.group({
      nombre: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.cargarDocumentos()
  }

  cargarDocumentos(){
    this.documentosService.cargarDocumentosGenerales().subscribe({
      next: (resp) => {
        console.log("Documentos Generales ", resp)
        this.documentos = resp
      }
    })
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
    console.log(id)
    this.documento = this.documentos.filter(doc => doc._id === id)
    console.log(this.documento[0])
    this.actualizacionDocumentoForm.patchValue({
      nombre: this.documento[0].nombre
    })
  }

  actualizarDocumento() {

  }

  eliminarDocumento(id: string) {
    this.documentosService.eliminarDocumento(id).subscribe({
      next: (resp: any) => {
        Swal.fire({
          text: resp.msg,
          icon: "success"
        });
      },
      error: (error) => {
        Swal.fire({
          title: "Oops...",
          icon: "error",
          text: error.msg,
        });
      }
    })
  }
}

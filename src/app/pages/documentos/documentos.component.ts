import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {  Router } from '@angular/router';
import { Documentos } from 'src/app/models/documentos.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { BuscarService } from 'src/app/services/buscar.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2'
import { NewDocumentoComponent } from '../modals/new-documento/new-documento.component';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  //public usuarios: Usuarios[] = []

  //public usuario: any
  //public cambioDeUsuario: boolean = false

  @ViewChild('modalNewDocument') modalNewDocument!: NewDocumentoComponent

  documentos: Documentos[] = []
  documento: any
  facturas: Documentos[] = [];
  informes: Documentos[] = [];
  estados: string[] = ['PENDIENTE', 'LISTO', 'RECHAZADO'];
  pf: number = 1;
  pi: number = 1;
  private usuarioLogueadoID: any

  constructor(
    private buscarService: BuscarService,
    private localStorageService: LocalStorageService,
    private documentosService: DocumentosService,
    private router: Router,
    private alertMessageService: AlertMessageService) {

  }

  ngOnInit(): void {
    this.usuarioLogueadoID = this.localStorageService.getItem('user', false)
    this.cargarDocumentos()
    //this.cargarUsusarios()
  }

  cargarDocumentos(){
    this.documentosService.cargarDocumentosGenerales().subscribe({
      next: (resp) => {
        this.documentos = resp

        this.facturas = this.documentos.filter(doc => doc.tipo === 'FACTURA');
        this.informes = this.documentos.filter(doc => doc.tipo === 'INFORME');
      }
    })
  }

  buscar(lista: string, termino: string) {
    if(termino.length > 0) {
      if(lista === 'facturas') {
        this.buscarService.buscarTermino('documentos', termino).subscribe({
          next: (resp: any[]) => {
            this.documentos = resp

            this.facturas = this.documentos.filter(doc => doc.tipo === 'FACTURA');
            this.informes = this.documentos.filter(doc => doc.tipo === 'INFORME');
          }
        })
      } else {
        this.buscarService.buscarTermino('documentos', termino).subscribe({
          next: (resp: any[]) => {
            this.documentos = resp

            this.facturas = this.documentos.filter(doc => doc.tipo === 'FACTURA');
            this.informes = this.documentos.filter(doc => doc.tipo === 'INFORME');
          }
        })
      }
    } else {
      this.cargarDocumentos()
    }
  }

  editarDocumento(documento: any) {
    this.modalNewDocument.usuario = this.usuarioLogueadoID
    this.modalNewDocument.titulo = "Modificar datos del documento"
    this.modalNewDocument.data = documento
    this.modalNewDocument.tipo = "UPDATE"

    this.modalNewDocument.openModal();
  }

  mostrarDatosDocumento(documento: any){
    this.modalNewDocument.usuario = this.usuarioLogueadoID
    this.modalNewDocument.tipo = "VIEWSAVE"
    this.modalNewDocument.titulo = "Ver datos del documento"
    this.modalNewDocument.data = documento
    this.modalNewDocument.openModal();
  }

  mostrarControlesEdicion(documento: any): boolean {
    return this.usuarioLogueadoID === documento.usuarioCreacion?._id ? true : false
  }

  cambioEstado(documento: any) {
    this.documentosService.editarDocumento(documento).subscribe({
      next: (resp) => {
        this.alertMessageService.mensajeCortoExitosoOk("Datos Guardados")

        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos`);
        });
      },
      error: (error) => {
        this.alertMessageService.mensajeErrorOk(error.status, "Oops...", error.msg)
      }
    })
  }

  subirArchivo(id: string) {
    this.router.navigateByUrl(`/dashboard/documentos/${id}`)
  }

  eliminarDocumento(id: string) {
    Swal.fire({
      title: "Confirma la acción?",
      text: "Confirma que desea eliminar el documento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#745af2",
      cancelButtonColor: "#ef5350",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentosService.eliminarDocumento(id).subscribe({
          next: (resp: any) => {
            this.alertMessageService.mensajeCortoExitosoOk("Datos Guardados")

            this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(`/dashboard/documentos`);
            });
          },
          error: (error) => {
            this.alertMessageService.mensajeErrorOk(error.status, "Oops...", error.msg)
          }
        })
      }
    });
  }


/*
cambiarUsuario() {
    if(this.cambioDeUsuario===false) {
      this.cambioDeUsuario = true
    } else {
      this.cambioDeUsuario = false
    }
  }
*/

}

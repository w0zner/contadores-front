import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Documentos } from 'src/app/models/documentos.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NewDocumentoComponent } from '../modals/new-documento/new-documento.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-mis-documentos',
  templateUrl: './mis-documentos.component.html',
  styleUrls: ['./mis-documentos.component.css']
})
export class MisDocumentosComponent implements OnInit{

  @ViewChild('modalNewDocument') modalNewDocument!: NewDocumentoComponent
  cargando: boolean
  documentos: Documentos[] = []
  p: number = 1;
  private usuarioLogueadoID: string

  constructor(
    private activatedRouted: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private documentosService: DocumentosService,
    private router: Router,
    private alertMessageService: AlertMessageService){
      this.cargando = false
      this.usuarioLogueadoID = this.localStorageService.getItem('user', false)
  }

  editarDocumento(documento: any) {
    this.modalNewDocument.usuario = this.usuarioLogueadoID
    this.modalNewDocument.titulo = "Modificar datos del documento"
    this.modalNewDocument.data = documento
    this.modalNewDocument.tipo = "UPDATE"

    this.modalNewDocument.openModal();
  }

  nuevoDocumento(){
    this.modalNewDocument.usuario = this.usuarioLogueadoID
    this.modalNewDocument.titulo = "Crear documento"
    this.modalNewDocument.tipo = "INSERT"
    this.modalNewDocument.data = {}
    this.modalNewDocument.openModal();
  }

  mostrarDatosDocumento(documento: any){
    this.modalNewDocument.tipo = "VIEW"
    this.modalNewDocument.titulo = "Ver datos del documento"
    this.modalNewDocument.data = documento
    this.modalNewDocument.openModal();
  }

  ngOnInit(): void {
    this.activatedRouted.params.subscribe(({id}) => {
      this.cargandoDocumentosPersonalesID(id)
    })
  }

  cargandoDocumentosPersonalesID(id: string) {
    this.cargando = true
    this.documentosService.cargarMisDocumentos(id).subscribe(resp => {
      this.documentos = resp
      this.cargando = false
    })
  }

  mostrarControlesEdicion(documento: any): boolean {
    return this.usuarioLogueadoID === documento.usuarioCreacion?._id && documento.estado === 'PENDIENTE' || documento.estado === 'INCOMPLETO' || documento.estado === 'RECHAZADO' ? true : false
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
            this.alertMessageService.mensajeCortoExitosoOk(resp.msg)

            this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.usuarioLogueadoID}`)
            });
          },
          error: (error) => {
            this.alertMessageService.mensajeErrorOk(error.status, "Oops...", error.msg)
          }
        })
      }
    });
  }
}

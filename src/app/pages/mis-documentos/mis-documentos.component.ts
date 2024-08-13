import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Documentos } from 'src/app/models/documentos.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import Swal from 'sweetalert2'
import { NewDocumentoComponent } from '../modals/new-documento/new-documento.component';

@Component({
  selector: 'app-mis-documentos',
  templateUrl: './mis-documentos.component.html',
  styleUrls: ['./mis-documentos.component.css']
})
export class MisDocumentosComponent implements OnInit{

  @ViewChild('fileInput') fileInput:ElementRef | undefined;
  @ViewChild('modalClose') modalClose:ElementRef | undefined;

  private cargando: boolean = false
  public nuevoDocumentoForm: FormGroup
  public actualizacionDocumentoForm: FormGroup
  public documento: any
  public documentos: Documentos[] = []
  public formSubmit = false
  private usuarioLogueadoID: string
  private subscription: Subscription | undefined;
  p: number = 1;

  @ViewChild('modalNewDocument') modalNewDocument!: NewDocumentoComponent

  constructor(
    private activatedRouted: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private documentosService: DocumentosService,
    private fb: FormBuilder,
    private router: Router,
    private alertMessageService: AlertMessageService){

    this.usuarioLogueadoID = this.localStorageService.getItem('user', false)

    this.actualizacionDocumentoForm = fb.group({
      nombre: ['', Validators.required],
      fecha: [''],
      usuario: [null],
      observacion: ['']
    })

    this.nuevoDocumentoForm= this.fb.group({
      nombre: ['', Validators.required],
      usuario: [this.usuarioLogueadoID, Validators.required],
      fecha: ['', Validators.required]
    })
  }

  editar(documento: any) {
    this.modalNewDocument.usuarioLogueadoID = this.usuarioLogueadoID
    this.modalNewDocument.titulo = "Modificar datos del documento"
    this.modalNewDocument.data = documento
    this.modalNewDocument.tipo = "UPDATE"
    this.modalNewDocument.openModal();
  }

  nuevo(){
    this.modalNewDocument.titulo = "Crear documento"
    this.modalNewDocument.tipo = "INSERT"
    this.modalNewDocument.openModal();
  }

  ngOnInit(): void {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.reloadComponent(); // Lógica para recargar los datos o el componente
      }
    });

    this.activatedRouted.params.subscribe(({id}) => {
      this.cargandoDocumentosPersonalesID(id)
    })
  }

  reloadComponent() {
    // Lógica de recarga del componente
    console.log('reload');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargandoDocumentosPersonalesID(id: string) {
    this.cargando = true
    this.documentosService.cargarMisDocumentos(id).subscribe(resp => {
      this.documentos = resp
      this.cargando = false
    })
  }


  //-----------------------------------------------------------------------------------------------------------//

  seleccionarDocumento(id: string){
    //Obtener documento de la lista de documentos
    this.documento = this.documentos.filter(doc => doc._id === id)

    this.actualizacionDocumentoForm.patchValue({
      nombre: this.documento[0].nombre,
      fecha: this.documento[0].fecha,
      observacion: this.documento[0].observacion,
    })
  }

  actualizarDocumento() {
    this.formSubmit = true

    if(this.actualizacionDocumentoForm.invalid){
      return;
    }

    let doc: Documentos = this.documento[0]
    doc.nombre = this.actualizacionDocumentoForm.get('nombre')?.value
    doc.fecha = this.actualizacionDocumentoForm.get('fecha')?.value

    this.documentosService.editarDocumento(doc).subscribe({
      next: (resp) => {
        this.alertMessageService.mensajeCortoExitosoOk("Documento actualizado exitosamente!")

        this.fileInput?.nativeElement.click();
        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.usuarioLogueadoID}`)
        });
      },
      error: (error) => {
        this.alertMessageService.mensajeErrorOk(error.status, "Oops...", "Ocurrio un error al actualizar el documento")
      }
    })
  }

  editarArchivo(id: string) {
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

  campoNoValidoNuevoDoc(campo: string):boolean {
    if(this.nuevoDocumentoForm.get(campo)?.invalid && this.formSubmit) {
      return true;
    } else {
      return false;
    }
  }

  campoNoValidoActualizacion(campo: string):boolean {
    if(this.actualizacionDocumentoForm.get(campo)?.invalid && this.formSubmit) {
      return true;
    } else {
      return false;
    }
  }

  guardarDocumento() {
    this.formSubmit = true
    if(this.nuevoDocumentoForm.invalid) {
      return
    }

    this.documentosService.crearDocumento(this.nuevoDocumentoForm.value).subscribe({
      next: (resp:any) => {
        this.alertMessageService.mensajeFlashConfirmation("Datos Guardados")

        this.modalClose?.nativeElement.click();
        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos/${resp.documento._id}`);
        });
      }
    })
  }

  mostrarControlesEdicion(documento: any): boolean {
    return this.usuarioLogueadoID === documento.usuarioCreacion?._id && documento.estado === 'PENDIENTE' || documento.estado === 'INCOMPLETO' || documento.estado === 'RECHAZADO' ? true : false
  }
}

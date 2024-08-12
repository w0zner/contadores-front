import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Documentos } from 'src/app/models/documentos.model';
import { Usuarios } from 'src/app/models/usuarios.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { BuscarService } from 'src/app/services/buscar.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  @ViewChild('fileInput') fileInput:ElementRef | undefined;
  @ViewChild('modalObs') modalObs:ElementRef | undefined;

  public actualizacionDocumentoForm: FormGroup
  public documentos: Documentos[] = []
  public usuarios: Usuarios[] = []
  public documento: any
  public usuario: any
  public cambioDeUsuario: boolean = false
  formSubmit = false
  private subscription: Subscription | undefined;
  private usuarioLogueadoID: any

  facturas: Documentos[] = [];
  informes: Documentos[] = [];

  public estados: string[] = ['PENDIENTE', 'LISTO', 'RECHAZADO'];

  pf: number = 1;
  pi: number = 1;

  constructor(
    private buscarService: BuscarService,
    private localStorageService: LocalStorageService,
    private documentosService: DocumentosService,
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: UsuarioService,
    private alertMessageService: AlertMessageService) {
    this.actualizacionDocumentoForm = fb.group({
      _id: [''],
      nombre: ['', Validators.required],
      fecha: [''],
      estado: [''],
      usuario: [''],
      observacion: ['']
    })
  }

  ngOnInit(): void {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.reloadComponent(); // Lógica para recargar los datos o el componente
      }
    });
    this.usuarioLogueadoID = this.localStorageService.getItem('user', false)
    this.cargarDocumentos()
    this.cargarUsusarios()
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

  cargarUsusarios() {
    this.usuariosService.cargarUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response
      }
    })
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
            console.log(this.documentos)

            this.facturas = this.documentos.filter(doc => doc.tipo === 'FACTURA');
            this.informes = this.documentos.filter(doc => doc.tipo === 'INFORME');
            console.log(this.facturas)
            console.log(this.informes)
          }
        })
      }
    } else {
      this.cargarDocumentos()
    }
  }

  campoNoValido(campo: string):boolean {
    if(this.actualizacionDocumentoForm.get(campo)?.invalid && this.formSubmit) {
      return true;
    } else {
      return false;
    }
  }

  seleccionarDocumento(id: string) {
    this.documento = this.documentos.filter(doc => doc._id === id)
    this.actualizacionDocumentoForm.patchValue({
      _id: this.documento[0]._id,
      nombre: this.documento[0].nombre,
      fecha: this.documento[0].fecha,
      estado: this.documento[0].estado,
      observacion: this.documento[0].observacion,
      usuario: this.documento[0].usuario
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
    //doc.usuario = this.actualizacionDocumentoForm.get('usuario')?.value
    this.documentosService.editarDocumento(doc).subscribe({
      next: (resp) => {
        this.alertMessageService.mensajeCortoExitosoOk("Datos Guardados")

        this.fileInput?.nativeElement.click();
        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos`);
        });
      },
      error: (error) => {
        this.alertMessageService.mensajeErrorOk(error.status, "Oops...", error.msg)
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

  cambiarUsuario() {
    if(this.cambioDeUsuario===false) {
      this.cambioDeUsuario = true
    } else {
      this.cambioDeUsuario = false
    }
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

  actualizarObsercion() {
    this.documentosService.editarDocumento(this.actualizacionDocumentoForm.value).subscribe({
      next: (resp) => {
        console.log(resp)
        this.alertMessageService.mensajeCortoExitosoOk("Datos Guardados")

        this.modalObs?.nativeElement.click();
        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos`);
        });
      },
      error: (error) => {
        this.alertMessageService.mensajeErrorOk(error.status, "Oops...", error.msg)
      }
    })
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Documentos } from 'src/app/models/documentos.model';
import { DocumentosService } from 'src/app/services/documentos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-mis-documentos',
  templateUrl: './mis-documentos.component.html',
  styleUrls: ['./mis-documentos.component.css']
})
export class MisDocumentosComponent implements OnInit{

  @ViewChild('fileInput') fileInput:ElementRef | undefined;
  @ViewChild('modalClose') modalClose:ElementRef | undefined;
  cargando: boolean = false
  public documentos: Documentos[] = []
  public actualizacionDocumentoForm: FormGroup
  public nuevoDocumentoForm: FormGroup
  public documento: any
  public usuario: any
  formSubmit = false
  public userLogged: string = ''
  private subscription: Subscription | undefined;

  constructor(private activatedRouted: ActivatedRoute, private documentosService: DocumentosService, private fb: FormBuilder, private router: Router, private usuariosService: UsuarioService){
    this.userLogged = this.usuariosService.getUserLogged()

    this.actualizacionDocumentoForm = fb.group({
      nombre: ['', Validators.required],
      fecha: [''],
      usuario: [null]
    })

    this.nuevoDocumentoForm= this.fb.group({
      nombre: ['', Validators.required],
      usuario: [this.userLogged, Validators.required],
      fecha: ['', Validators.required]
    })
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

  editarDocumento(id: string){
    this.documento = this.documentos.filter(doc => doc._id === id)
    this.usuario = this.documento[0].usuario.nombre
    //this.usuarios = this.usuarios.filter(user => user.uid !== this.documento[0].usuario._id)
    this.actualizacionDocumentoForm.patchValue({
      nombre: this.documento[0].nombre,
      fecha: this.documento[0].fecha,
      //usuario: new Usuarios(this.documento[0].usuario.nombre, '', '', '', '', '', 'USER_ROLE', this.documento[0].usuario._id)
    })
    this.actualizacionDocumentoForm.get('usuario')?.setValue(this.documento[0].usuario);
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
        Swal.fire({
          text: "Documento actualizado exitosamente!",
          icon: "success"
        });
        this.fileInput?.nativeElement.click();
        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos`);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un error al actualizar el documento",
        });
      }
    })
  }

  editarArchivo(id: string) {
    this.router.navigateByUrl(`/dashboard/documentos/${id}`)
  }

  eliminarDocumento(id: string) {
    Swal.fire({
      title: "Confirma la acción?",
      text: "Confirma que desea eliminar el documento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06d79c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentosService.eliminarDocumento(id).subscribe({
          next: (resp: any) => {
            Swal.fire({
              text: resp.msg,
              icon: "success"
            });

            this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(`/dashboard/documentos`);
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
    });
  }

  campoNoValido(campo: string):boolean {
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
        Swal.fire({
          text: "Datos Guardados",
          icon: "success",
          showConfirmButton: false,
          timer: 800
        });
        this.modalClose?.nativeElement.click();
        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos/${resp.documento._id}`);
        });
        //this.router.navigateByUrl(`/dashboard/documentos/${resp.documento._id}`)
      }
    })
  }
}

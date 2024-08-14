import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-new-documento',
  templateUrl: './new-documento.component.html',
  styleUrls: ['./new-documento.component.css']
})
export class NewDocumentoComponent implements OnInit {

  @Input() usuario?: string
  @Input() tipo: string
  @Input() titulo: string
  @Input() data?: any

  isVisible = false;
  isSubmit: boolean
  documentoForm: FormGroup

  constructor(private fb: FormBuilder, private documentosService: DocumentosService, private alertMessageService: AlertMessageService, private router: Router, private usuariosService: UsuarioService) {
    this.titulo = ""
    this.usuario = ""
    this.tipo = 'UPDATE | INSERT | VIEW | VIEWSAVE'
    this.isSubmit = false

    this.documentoForm = fb.group({
      nombre: ['', Validators.required],
      fecha: [''],
      usuario: [null],
      observacion: ['']
    })
  }

  ngOnInit(): void { }

  openModal() {
    this.isVisible = true;

    if(this.tipo === "UPDATE" || this.tipo === "VIEWSAVE" || this.tipo === "VIEW") {
      this.documentoForm.patchValue({
        nombre: this.data.nombre,
        fecha: this.data.fecha,
        usuario: this.data.usuario,
        observacion: this.data.observacion || ''
      })
    } else {
      this.documentoForm.reset()
      this.documentoForm.patchValue({
        usuario: this.usuario,
        observacion: ''
      })
    }
  }

  closeModal() {
    this.isVisible = false;
  }

  campoNoValido(campo: string):boolean {
    if(this.documentoForm.get(campo)?.invalid && this.isSubmit) {
      return true;
    } else {
      return false;
    }
  }

  almacenarDocumento() {
    this.isSubmit = true

    if(this.documentoForm.invalid){
      return;
    }

    if(this.tipo === "UPDATE" || this.tipo === "VIEWSAVE") {
      this.data.nombre = this.documentoForm.get('nombre')?.value
      this.data.fecha = this.documentoForm.get('fecha')?.value
      this.data.observacion = this.documentoForm.get('observacion')?.value

      this.documentosService.editarDocumento(this.data).subscribe({
        next: (resp) => {
          this.alertMessageService.mensajeCortoExitosoOk("Documento actualizado exitosamente!")

          this.obtenerRolUsuario()
        },
        error: (error) => {
          this.alertMessageService.mensajeErrorOk(error.status, "Oops...", "Ocurrio un error al actualizar el documento")
        }
      })
    } else  if(this.tipo === "INSERT") {
      this.documentosService.crearDocumento(this.documentoForm.value).subscribe({
        next: (resp:any) => {
          this.alertMessageService.mensajeFlashConfirmation("Datos Guardados")

          this.obtenerRolUsuario()
        }
      })
    }
  }

  obtenerRolUsuario() {
    this.usuariosService.obtenerUsuarioPorId(this.usuario!).subscribe({
      next: (resp) => {
        if(resp.role==='USER_ROLE') {
          this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.usuario}`)
          });
        } else if(resp.role==='ADMIN_ROLE') {
          this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(`/dashboard/documentos`)
          });
        }
      }
    })
  }

}

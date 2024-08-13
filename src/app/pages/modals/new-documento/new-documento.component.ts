import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Documentos } from 'src/app/models/documentos.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
  selector: 'app-new-documento',
  templateUrl: './new-documento.component.html',
  styleUrls: ['./new-documento.component.css']
})
export class NewDocumentoComponent implements OnInit {

  @Input() usuarioLogueadoID?: string
  @Input() tipo: string
  @Input() titulo: string
  @Input() data?: any


  documentoForm: FormGroup
  formSubmit: boolean
  isVisible = false;

  constructor(private fb: FormBuilder, private documentosService: DocumentosService, private alertMessageService: AlertMessageService, private router: Router) {
    console.log("modal 1")
    this.titulo = ""
    this.usuarioLogueadoID = ""
    this.tipo = ""
    this.formSubmit = false

    this.documentoForm = fb.group({
      nombre: ['', Validators.required],
      fecha: [''],
      usuario: [null],
      observacion: ['']
    })
  }

  ngOnInit(): void {
    console.log("modal 2")
    console.log(this.titulo)
    console.log(this.data)
  }

  openModal() {
    this.isVisible = true;
    console.log("modal 3")
    console.log(this.titulo)
    console.log(this.data)
    console.log(this.tipo)
    if(this.tipo === "UPDATE") {
      this.documentoForm.patchValue({
        nombre: this.data.nombre,
        fecha: this.data.fecha,
        usuario: this.data.usuario,
        observacion: this.data.observacion || ''
      })
    }
  }

  closeModal() {
    this.isVisible = false;
  }

  campoNoValido(campo: string):boolean {
    if(this.documentoForm.get(campo)?.invalid && this.formSubmit) {
      return true;
    } else {
      return false;
    }
  }

  actualizarDocumento() {
    this.formSubmit = true

    if(this.documentoForm.invalid){
      return;
    }

    console.log(this.documentoForm.value)

    if(this.tipo === "UPDATE") {
      this.data.nombre = this.documentoForm.get('nombre')?.value
      this.data.fecha = this.documentoForm.get('fecha')?.value

      this.documentosService.editarDocumento(this.data).subscribe({
        next: (resp) => {
          this.alertMessageService.mensajeCortoExitosoOk("Documento actualizado exitosamente!")

          this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.usuarioLogueadoID}`)
          });
        },
        error: (error) => {
          this.alertMessageService.mensajeErrorOk(error.status, "Oops...", "Ocurrio un error al actualizar el documento")
        }
      })
    } else {
      this.documentosService.crearDocumento(this.documentoForm.value).subscribe({
        next: (resp:any) => {
          this.alertMessageService.mensajeFlashConfirmation("Datos Guardados")

          this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(`/dashboard/documentos/${resp.documento._id}`);
          });
        }
      })
    }
  }

}

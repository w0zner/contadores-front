import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Usuarios } from 'src/app/models/usuarios.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nuevo-documento',
  templateUrl: './nuevo-documento.component.html',
  styleUrls: ['./nuevo-documento.component.css']
})
export class NuevoDocumentoComponent implements OnInit {

  public nuevoDocumentoForm: FormGroup
  public usuarios: Usuarios[] = []
  public formSubmit = false
  public usuario: Usuarios | undefined

  constructor(private fb: FormBuilder, private usuariosService: UsuarioService, private documentosService: DocumentosService, private alertMessageService: AlertMessageService, private router: Router){
    this.nuevoDocumentoForm= this.fb.group({
      nombre: ['', Validators.required],
      estado: ['LISTO'],
      tipo: ['INFORME'],
      usuarioCreacion: [''],
      usuario: ['', Validators.required],
      fecha: ['', Validators.required]
    })
  }

  ngOnInit(): void {
     this.cargarUsusarios()

    this.nuevoDocumentoForm.patchValue({
      usuarioCreacion: this.usuario?.uid
    })
  }

  cargarUsusarios() {
    this.usuariosService.cargarUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response
      }
    })
  }

  campoNoValido(campo: string):boolean {
    if(this.nuevoDocumentoForm.get(campo)?.invalid && this.formSubmit) {
      return true;
    } else {
      return false;
    }
  }

  crearNuevoDocumento() {
    this.formSubmit = true
    if(this.nuevoDocumentoForm.invalid) {
      return
    }
    console.log(this.nuevoDocumentoForm.value)

    this.documentosService.crearDocumento(this.nuevoDocumentoForm.value).subscribe({
      next: (resp:any) => {
        this.alertMessageService.mensajeFlashConfirmation("Datos Guardados")
        this.router.navigateByUrl(`/dashboard/documentos/${resp.documento._id}`)
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Usuarios } from 'src/app/models/usuarios.model';
import { DocumentosService } from 'src/app/services/documentos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-nuevo-documento',
  templateUrl: './nuevo-documento.component.html',
  styleUrls: ['./nuevo-documento.component.css']
})
export class NuevoDocumentoComponent implements OnInit {

  public nuevoDocumentoForm: FormGroup
  public usuarios: Usuarios[] = []
  public formSubmit = false
  private userLoggedUID: string | undefined
  public usuario: Usuarios | undefined

  constructor(private fb: FormBuilder, private usuariosService: UsuarioService, private documentosService: DocumentosService, private router: Router){
    this.userLoggedUID = this.usuariosService.getUserLogged()
    this.obtenerUsuario()

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
      next: (resp) => {
        this.usuarios = resp
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

    this.documentosService.crearDocumento(this.nuevoDocumentoForm.value).subscribe({
      next: (resp:any) => {
        Swal.fire({
          text: "Datos Guardados",
          icon: "success",
          showConfirmButton: false,
          timer: 800
        });
        this.router.navigateByUrl(`/dashboard/documentos/${resp.documento._id}`)
      }
    })
  }

  obtenerUsuario() {
    this.usuariosService.getUsuario(this.userLoggedUID || '').subscribe({
      next: (resp) => {
        this.usuario = resp
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/app/models/usuarios.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { BuscarService } from 'src/app/services/buscar.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{

  public usuarios: Usuarios[] = []
  public usuarioLogueadoID: string = ''

  p: number = 1;

  constructor(private usuarioService: UsuarioService, private localStorageService: LocalStorageService, private buscarService: BuscarService, private alertMessageService: AlertMessageService) { }

  ngOnInit(): void {
    this.usuarioLogueadoID = this.localStorageService.getItem('user', false)
    this.cargarUsuarios()
  }

  cargarUsuarios(){
    this.usuarioService.cargarUsuarios().subscribe({
      next: (resp:any) => {
        this.usuarios = resp
      }
    })
  }

  buscar(termino: string) {
    if(termino.length > 0) {
      this.buscarService.buscarTermino('usuarios', termino).subscribe({
        next: (resp: any[]) => {
          this.usuarios = resp
        }
      })
    } else {
      this.cargarUsuarios()
    }
  }

  actualizarUsuario(user: Usuarios) {
    this.usuarioService.updateUser(user).subscribe({
      next: (resp: any) => {
        this.alertMessageService.mensajeCortoExitosoOk(resp.msg)
      },
      error: (error) => {
        this.alertMessageService.mensajeErrorOk(error.status, "Oops...", "Ocurrio un error al actualizar el usuario")
      }
    })
  }

  eliminarUsuario(id: string) {
    Swal.fire({
      title: "Confirma la acción?",
      text: "Confirma que desea eliminar el usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#745af2",
      cancelButtonColor: "#ef5350",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: (resp: any) => {
            this.alertMessageService.mensajeCortoExitosoOk(resp.msg)
            this.cargarUsuarios()
          },
          error: (error) => {
            this.alertMessageService.mensajeErrorOk(error.status, "Oops...", error.msg)
          }
        })
      }
    });
  }
}

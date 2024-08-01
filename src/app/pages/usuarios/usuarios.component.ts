import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/app/models/usuarios.model';
import { BuscarService } from 'src/app/services/buscar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{

  public usuarios: Usuarios[] = []

  p: number = 1;

  constructor(private usuarioService: UsuarioService, private buscarService: BuscarService) {

  }

  ngOnInit(): void {
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

  cambiarRole(user: Usuarios) {
    this.usuarioService.updateRoleUser(user).subscribe({
      next: (resp: any) => {
        Swal.fire({
          text: resp.msg,
          icon: "success"
        });
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un error al actualizar el usuario",
        });
      }
    })
  }

  eliminarUsuario(id: string) {
    Swal.fire({
      title: "Confirma la acción?",
      text: "Confirma que desea eliminar el usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06d79c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUser(id).subscribe({
          next: (resp: any) => {
            Swal.fire({
              text: resp.msg,
              icon: "success"
            });
            this.cargarUsuarios()
          },
          error: (error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrio un error al eliminar el usuario",
            });
          }
        })
      }
    });
  }
}

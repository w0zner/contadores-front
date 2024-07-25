import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup
  public usuario: any
  public isSubmit: boolean = false

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder){
    this.usuario=this.usuarioService.usuario
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, Validators.email],
      curp: [this.usuario.curp, Validators.required],
      telefono: [this.usuario.telefono, Validators.required]
     })
  }

  ngOnInit(): void {
   
  }

  verificarForm():boolean{
    if(this.perfilForm.invalid) {
      return true
    } else {
      return false
    }

  }

  actualizarPerfil(){
    this.isSubmit = true
    if(this.perfilForm.invalid) {
      return;
    } 

    Swal.fire({
      title: "Confirma la acción?",
      text: "Confirma que desea actualizar su perfil?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06d79c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, actualizar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Actualizando...")
        console.log(this.perfilForm)
        /*Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });*/
      }
    });

      
  }

}

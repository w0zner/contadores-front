import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup
  formSubmit= false

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService){
    this.loginForm= this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login(){
    this.formSubmit=true;
    if(this.loginForm.invalid){
      return;
    }

    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (response) => {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Bienvenido!",
          showConfirmButton: false,
          timer: 1500
        });

        this.router.navigateByUrl('/dashboard/perfil')
      },
      error: (error)=> {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.error.msg,
        });
      }
    })
  }

  campoValido(campo: string): boolean{
    if(this.loginForm.get(campo)?.invalid && this.formSubmit){
      return true
    } else {
      return false
    }
  }
}

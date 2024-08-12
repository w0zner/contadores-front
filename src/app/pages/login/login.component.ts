import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertMessageService } from 'src/app/services/alert-message.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup
  formSubmit= false

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private alertMessageService: AlertMessageService){
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

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.alertMessageService.mensajeFlash("Bienvenido!")
        this.router.navigateByUrl('/dashboard/perfil')
      },
      error: (error)=> {
        this.alertMessageService.mensajeErrorOk(error.status, "Oops...", error.error.msg)
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { AlertMessageService } from 'src/app/services/alert-message.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  registroForm: FormGroup;
  formSubmit= false

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private alertMessageService: AlertMessageService, private router: Router){
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    {
      Validators: this.passwordIguales('password', 'confirmPassword')
    })
  }

  registro() {
    this.formSubmit=true;

    if(this.registroForm.invalid){
      return;
    }
    this.usuarioService.crearUsuario(this.registroForm.value).subscribe({
      next: (response) => {
        this.alertMessageService.mensajeExitosoOk("Registro exitoso!", "Estas listo para iniciar sesión..")
        this.router.navigateByUrl('/login')
      },
      error: (error) => {
        this.alertMessageService.mensajeErrorOk("Oops...", error.error.msg)
      }
    })
  }

  campoValido(campo: string): boolean{
    if(this.registroForm.get(campo)?.invalid && this.formSubmit){
      return true
    } else {
      return false
    }
  }

  passwordValido(): boolean {
    const pass1=this.registroForm.get('password')?.value
    const pass2=this.registroForm.get('confirmPassword')?.value

    if(pass1 !== pass2 && this.formSubmit) {
      return true
    } else {
      return false
    }
  }

  passwordIguales(data1: string, data2: string){
    return (formGroup: FormGroup) => {
      const pass1= formGroup.get('password')
      const pass2= formGroup.get('confirmPassword')

      if(pass1?.value === pass2?.value) {
        pass2?.setErrors(null)
      } else {
        pass2?.setErrors({noEsIgual: true})
      }
    }
  }

}

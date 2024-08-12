import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {

  constructor() { }

  mensajeFlash(titulo: string){
    Swal.fire({
      position: "top",
      icon: "success",
      title: titulo,
      showConfirmButton: false,
      timer: 1500
    });
  }

  mensajeFlashConfirmation(titulo: string){
    Swal.fire({
      icon: "success",
      title: titulo,
      showConfirmButton: false,
      timer: 700
    });
  }

  mensajeCortoExitosoOk(mensaje: string){
    Swal.fire({
      text: mensaje,
      icon: "success"
    });
  }

  mensajeExitosoOk(titulo: string, mensaje: string){
    Swal.fire({
      icon: "success",
      title: titulo,
      text: mensaje
    });
  }

  mensajeErrorOk(status: any, titulo: string, mensaje: string){
    if(status==0) {
      Swal.fire({
        icon: "error",
        title: titulo,
        text: "El sistema no responde, contacte con el administrador"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: titulo,
        text: mensaje
      });
    }
  }

  mensajeWarning(){

  }
}

import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  public usuario: any

  constructor(private usuarioService: UsuarioService){
    this.usuario=this.usuarioService.usuario
    console.log("Desde perfil", this.usuario)
  }

}

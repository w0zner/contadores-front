import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const usuarioService= inject(UsuarioService);

  usuarioService.getUserLogged()
  return true;
};

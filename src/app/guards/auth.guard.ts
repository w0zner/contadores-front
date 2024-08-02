import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const usuarioService= inject(UsuarioService);
  const router= inject(Router);


  return usuarioService.refreshToken()
  .pipe(
    tap(isLogged => {
      console.log("guard", isLogged)
      if(!isLogged) {
        router.navigateByUrl('/login')
      }
    })
  )
};

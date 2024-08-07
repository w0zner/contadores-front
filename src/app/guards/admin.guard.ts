import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { tap, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService= inject(AuthService);
  const router= inject(Router);


  return of(authService.usuario.role === 'ADMIN_ROLE')
  .pipe(
    tap(isAdmin => {
      if(!isAdmin) {
        router.navigateByUrl('/dashboard/perfil')
      }
    })
  )
   /*authService.refreshToken()
  .pipe(
    tap(isLogged => {
      console.log("guard", isLogged)
      if(!isLogged) {
        router.navigateByUrl('/login')
      }
    })
  )*/
};

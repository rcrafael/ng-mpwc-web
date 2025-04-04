import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);

  if(token && token !== '') {
    if(authService.isValidToken(token.toString())) {
      return true;
    } else {
      router.navigateByUrl('auth/login');
    }
  }
  
  router.navigateByUrl('auth/login');
  return false ;
};

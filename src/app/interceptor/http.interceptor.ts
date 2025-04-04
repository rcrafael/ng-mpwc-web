import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);

  if(token && token !== '') {

    if(authService.isValidToken(token.toString())) {
      const cloneRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${token}`}
      })
      return next(cloneRequest);
    } else {
      router.navigateByUrl('auth/login');
    }
    
  }

  return next(req);
};

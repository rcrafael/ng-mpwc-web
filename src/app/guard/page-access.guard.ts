import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

export const pageAccessGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const router = inject(Router);

  const requiredPage = route.data?.['page'] as string;
  if (!requiredPage) {
    return true;
  }

  if (authService.hasPageAccess(requiredPage)) {
    return true;
  }

  await alertService.alert('You do not have permission to access this page. Please contact your administrator.', {
    icon: 'warning',
    confirmButtonText: 'Understood'
  });

  router.navigateByUrl('/dashboard');
  return false;
};

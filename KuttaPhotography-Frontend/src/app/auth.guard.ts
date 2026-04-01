import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    if (state.url.startsWith('/admin') && !authService.isAdmin) {
      router.navigate(['/']);
      return false;
    }
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated.pipe(
    map((isAuth) => !isAuth),
    tap((canActivate) => {
      // redirect to home page if user is already authenticated
      if (!canActivate) {
        router.navigate(['/home']);
      }
    }),
  );
};

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { tap } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  // TODO: jwtToken is now being intercepted but the pages won't load when jwtToken is set
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const token = event.headers.get('Authorization');
        console.log(token); // Output the token to verify
        if (token) {
          jwtService.saveToken(token);
        }
      }
    }),
  );
};

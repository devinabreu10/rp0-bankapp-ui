import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../services/jwt.service';
import { inject } from '@angular/core';

/**
 * This tokenInterceptor adds an Authorization header with a Bearer token to
 * outgoing HTTP requests if a token is available.
 *
 * @param req - The HTTP request object.
 * @param next - The next interceptor in the chain.
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();

  const request = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return next(request);
};

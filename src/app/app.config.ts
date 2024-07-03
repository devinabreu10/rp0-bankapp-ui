import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/auth/interceptors/token.interceptor';
import { JwtService } from './core/auth/services/jwt.service';
import { AuthService } from './core/auth/services/auth.service';
import { EMPTY } from 'rxjs';

export function initAuth(jwtService: JwtService, authService: AuthService) {
  return () => (jwtService.getToken() ? authService.getCurrentUser() : EMPTY);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [JwtService, AuthService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: tokenInterceptor,
      multi: true,
    },
  ],
};

import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { Observable, of } from 'rxjs';

describe('authGuard', () => {
  let authServiceMock: any;
  let routerMock: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated: of(false) // Default value
    };
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
          },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow user to access route if user is not authenticated', () => {
    authServiceMock.isAuthenticated = of(false);
    const activatedRouteMock = TestBed.inject(ActivatedRoute);

    const result = TestBed.runInInjectionContext(
      () =>
        authGuard(
          activatedRouteMock.snapshot,
          {} as RouterStateSnapshot,
        ) as Observable<boolean>,
    );

    result.subscribe((canActivate) => {
      expect(canActivate).toBeTrue();
    });
  })

  it('should redirect user to accounts page if user is already authenticated', () => {
    authServiceMock.isAuthenticated = of(true);
    const activatedRouteMock = TestBed.inject(ActivatedRoute);

    const result = TestBed.runInInjectionContext(
      () =>
        authGuard(
          activatedRouteMock.snapshot,
          {} as RouterStateSnapshot,
        ) as Observable<boolean>,
    );

    result.subscribe((canActivate) => {
      expect(canActivate).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/accounts']);
    });
  });
});

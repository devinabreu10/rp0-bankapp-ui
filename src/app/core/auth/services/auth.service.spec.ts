import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserAuth } from '../user-auth.model';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { RegisterAuth } from '../register-auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let jwtServiceMock: JwtService;
  let routerMock: Router;

  beforeEach(() => {
    jwtServiceMock = jasmine.createSpyObj('JwtService', ['saveToken', 'destroyToken']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should make a POST request to the login endpoint and set auth user on success', () => {
      spyOn(service, 'setAuthUser').and.callThrough();
      const mockResponse: UserAuth = {
        token: 'token',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        address: 'test',
      };
      const credentials = { username: 'test', password: 'test' };

      service.login(credentials).subscribe((user) => {
        expect(user).toEqual(mockResponse);
        expect(service.setAuthUser).toHaveBeenCalledWith(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle error correctly', () => {
      const credentials = { username: 'test', password: 'password' };
      const errorMessage = 'Error has occurred; please try again later.';

      service.login(credentials).subscribe({
        next: () => fail('expected an error, not UserAuth'),
        error: (error) => expect(error.message).toContain(errorMessage),
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush('error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('register', () => {
    it('should make a POST request to the register endpoint and set auth user on success', () => {
      spyOn(service, 'setAuthUser').and.callThrough();
      const mockResponse: UserAuth = {
        token: 'token',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        address: 'test',
      };
      const registerAuth: RegisterAuth = {
        firstName: 'test',
        lastName: 'test',
        address: 'test',
        username: 'test',
        password: 'test',
      };

      service.register(registerAuth).subscribe((user) => {
        expect(user).toEqual(mockResponse);
        expect(service.setAuthUser).toHaveBeenCalledWith(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle server-side error correctly', () => {
      const registerAuth: RegisterAuth = {
        firstName: 'test',
        lastName: 'test',
        address: 'test',
        username: 'test',
        password: 'password',
      };
      const errorMessage = 'Error has occurred; please try again later.';

      service.register(registerAuth).subscribe({
        next: () => fail('expected an error, not UserAuth'),
        error: (error) => expect(error.message).toContain(errorMessage),
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush('error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getCurrentUser', () => {
    it('should make a GET request to the user endpoint and set auth user on success', () => {
      spyOn(service, 'setAuthUser').and.callThrough();
      const mockResponse: UserAuth = {
        token: 'token',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        address: 'test',
      };

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockResponse);
        expect(service.setAuthUser).toHaveBeenCalledWith(mockResponse);
      })

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/user`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should make a GET request and purge auth user on error', () => {
      spyOn(service, 'purgeAuthUser').and.callThrough();

      service.getCurrentUser().subscribe({
        next: () => fail('expected an error, not UserAuth'),
        error: () => expect(service.purgeAuthUser).toHaveBeenCalled()
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/user`);
      expect(req.request.method).toBe('GET');
      req.flush('error', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should call purgeAuthUser and navigate to /login', () => {
      spyOn(service, 'purgeAuthUser');

      service.logout();

      expect(service.purgeAuthUser).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('setAuthUser', () => {
    it('should save token and update currentUserSubject', () => {
      const mockUser: UserAuth = {
        token: 'token',
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        address: 'test',
      };

      service.setAuthUser(mockUser);

      expect(jwtServiceMock.saveToken).toHaveBeenCalledWith(mockUser.token);
      expect(service['currentUserSubject'].value).toEqual(mockUser);
    });
  });

  describe('purgeAuthUser', () => {
    it('should destroy token and update currentUserSubject', () => {
      service.purgeAuthUser();

      expect(jwtServiceMock.destroyToken).toHaveBeenCalled();
      expect(service['currentUserSubject'].value).toBeNull();
    });
  });

  describe('handleError', () => {
    it('should handle client-side error correctly', () => {
      const error = new HttpErrorResponse({
        error: new ErrorEvent('Network error', {
          message: 'Network error',
        }),
      });

      const spy = spyOn<any>(service, 'handleError').and.callThrough();

      const result = service['handleError'](error);

      expect(spy).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });
    // server-side error tested in previous unit tests
  });

  it('should return default value for isAuthenticated', () => {
    service.isAuthenticated.subscribe((isAuthenticated) => {
      expect(isAuthenticated).toBeFalsy();
    })
  });
});

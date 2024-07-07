import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { tokenInterceptor } from './token.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { JwtService } from '../services/jwt.service';

describe('tokenInterceptor', () => {
  let jwtService: jasmine.SpyObj<JwtService>;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => tokenInterceptor(req, next));

  beforeEach(() => {
    const jwtServiceSpy = jasmine.createSpyObj('JwtService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: JwtService, useValue: jwtServiceSpy },
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header if a token is present', () => {
    const token = 'testToken';
    jwtService.getToken.and.returnValue(token);

    const url = 'https://test.com';

    httpClient.get(url).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
  });

  it('should not add an Authorization header if no token is present', () => {
    jwtService.getToken.and.returnValue('');

    const url = 'https://test.com';

    httpClient.get(url).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});

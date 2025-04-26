import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent, RememberMe } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ThemeService } from '../../../../shared/services/theme.service';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', [], { theme$: of('light') });
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        CheckboxModule,
        NgStyle,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with rememberme values', () => {
    const loginForm = component.loginForm;
    const rememberme: RememberMe = { isRemember: false, username: '' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(rememberme));

    expect(loginForm).toBeDefined();

    expect(loginForm.value).toEqual({
      username: '',
      password: '',
      checked: false,
    });
  });

  it('should call login and navigate to home when form is successfully submitted', () => {
    authService.login.and.returnValue(
      of({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        address: '123 Main St',
        token: 'token',
      }),
    );

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should log error and add error toast when form is not successfully submitted', () => {
    spyOn(console, 'error');
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Login error:', jasmine.any(Error));
  });

  it('should set rememberme values in local storage on onSubmit', () => {
    const rememberme: RememberMe = { isRemember: false, username: '' };
    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(component, 'onSubmit').and.callThrough();

    authService.login.and.returnValue(
      of({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        address: '123 Main St',
        token: 'token',
      }),
    );

    component.loginForm.controls['username'].setValue(rememberme.username);
    component.loginForm.controls['password'].setValue('password');
    component.loginForm.controls['checked'].setValue(rememberme.isRemember);

    component.onSubmit();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'rememberme',
      JSON.stringify(rememberme),
    );
    expect(component.onSubmit).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalled();
  });

  it('should return true from isError method if form field has error and is touched', () => {
    component.loginForm.get('username')?.setErrors({ required: true });
    component.loginForm.get('username')?.markAsTouched();
    component.loginForm.get('password')?.setErrors({ required: true });
    component.loginForm.get('password')?.markAsTouched();

    expect(component.isError('username', 'required')).toBeTrue();
    expect(component.isError('password', 'required')).toBeTrue();
  });
});

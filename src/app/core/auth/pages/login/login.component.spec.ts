import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent, RememberMe } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ThemeService } from '../../../../shared/services/theme.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', [], { theme$: of('light') });

    await TestBed.configureTestingModule({
      imports: [LoginComponent, CheckboxModule, NgStyle, ReactiveFormsModule],
      providers: [{ provide: ThemeService, useValue: themeServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should intialize login form with rememberme values', () => {
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

  it('should set rememberme values in local storage on onSubmit', () => {
    const rememberme: RememberMe = { isRemember: false, username: '' };
    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(component, 'onSubmit').and.callThrough();

    component.loginForm.controls['username'].setValue(rememberme.username);
    component.loginForm.controls['password'].setValue('password');
    component.loginForm.controls['checked'].setValue(rememberme.isRemember);

    component.onSubmit();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'rememberme',
      JSON.stringify(rememberme),
    );
    expect(component.onSubmit).toHaveBeenCalled();
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

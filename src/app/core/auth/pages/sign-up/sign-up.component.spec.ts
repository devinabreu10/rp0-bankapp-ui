import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SignUpComponent } from "./sign-up.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignUpComponent, InputTextModule, PasswordModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signUpForm with default values', () => {
    const signUpForm = component.signUpForm;

    expect(signUpForm).toBeDefined();

    expect(signUpForm.value).toEqual({
      firstName: '',
      lastName: '',
      address: '',
      username: '',
      password: '',
    });
  });

  it('should mark form controls as required', () => {
    const formControls = component.signUpForm.controls;
    expect(formControls.firstName.hasError('required')).toBeTrue();
    expect(formControls.lastName.hasError('required')).toBeTrue();
    expect(formControls.address.hasError('required')).toBeFalse();
    expect(formControls.username.hasError('required')).toBeTrue();
    expect(formControls.password.hasError('required')).toBeTrue();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.signUpForm.controls.password;
    passwordControl.setValue('short');
    expect(passwordControl.hasError('minlength')).toBeTrue();
  });

  it('should call register and navigate to home when form is successfully submitted', () => {
    authService.register.and.returnValue(
      of({
        id: 1,
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        address: 'test',
        token: 'token',
      }),
    );

    component.onSubmit();

    expect(authService.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should log an error when form is not successfully submitted', () => {
    spyOn(console, 'error');
    authService.register.and.returnValue(throwError(() => new Error('Registration failed')));

    component.onSubmit();

    expect(authService.register).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Register error:', jasmine.any(Error));
  });

  it("should navigate to login when navigateLogIn is called", () => {
    component.navigateLogIn();
    expect(router.navigate).toHaveBeenCalledWith(["login"]);
  });
});

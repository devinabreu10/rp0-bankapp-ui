import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ThemeService } from '../../../../shared/services/theme.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

export interface RememberMe {
  isRemember: boolean;
  username: string;
}

interface ILogin {
  username: string;
  password: string;
  checked: boolean;
}

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
  checked: FormControl<boolean>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CheckboxModule,
    NgStyle,
    AsyncPipe,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  theme$: Observable<string>;
  loginForm: FormGroup<LoginForm>;
  destroyRef = inject(DestroyRef);

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.theme$ = this.themeService.theme$;

    this.loginForm = new FormGroup<LoginForm>({
      username: new FormControl(this.getRememberMe().username, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      checked: new FormControl(this.getRememberMe().isRemember, {
        nonNullable: true,
      }),
    });
  }

  private getRememberMe(): RememberMe {
    const storedRememberMe = localStorage.getItem('rememberme');
    return storedRememberMe
      ? JSON.parse(storedRememberMe)
      : { isRemember: false, username: '' };
  }

  onSubmit(): void {
    const { checked, username, password } = this.loginForm.value as ILogin;
    const rememberme: RememberMe = {
      isRemember: checked,
      username: checked ? username : '',
    };
    localStorage.setItem('rememberme', JSON.stringify(rememberme));

    this.authService
      .login({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['']),
        error: (err) => {
          console.error('Login error:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid username or password',
          });
          // this.loginForm.get('password')?.setErrors({ invalid: true });
        },
      });
  }

  isError(field: string, error: string): boolean | undefined {
    return this.loginForm.get(field)?.hasError(error) && this.loginForm.get(field)?.touched;
  }
}

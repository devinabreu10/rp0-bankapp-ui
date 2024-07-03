import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

interface ISignUp {
  firstName: string;
  lastName: string;
  address?: string;
  username: string;
  password: string;
}

interface SignUpForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  address: FormControl<string | null>;
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputTextModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent {
  signUpForm: FormGroup<SignUpForm>;
  destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.signUpForm = new FormGroup<SignUpForm>({
      firstName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      address: new FormControl('', {
        nonNullable: false,
      }),
      username: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
        nonNullable: true,
      }),
    });
  }

  onSubmit(): void {
    const { firstName, lastName, address, username, password } = this.signUpForm
      .value as ISignUp;

    this.authService
      .register({ firstName, lastName, address, username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/home']),
        error: (err) => {
          console.error('Register error:', err);
        },
      });
  }
}

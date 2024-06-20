import { AsyncPipe, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ThemeService } from '../../../../shared/services/theme.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface RememberMe {
  isRemember: boolean;
  username: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CheckboxModule, NgStyle, AsyncPipe, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  theme$: Observable<string>;
  rememberme: RememberMe = JSON.parse(localStorage.getItem('rememberme') ?? 'false');
  loginForm = new FormGroup({
    username: new FormControl(this.rememberme.username, Validators.required),
    password: new FormControl('', Validators.required),
    checked: new FormControl(this.rememberme.isRemember),
  });

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
    console.log(this.rememberme);
  }

  ngOnInit() {}

  onSubmit() {
    console.warn(this.loginForm.value);
    const rememberme: RememberMe = {
      isRemember: this.loginForm.value.checked ?? false,
      username: this.loginForm.value.checked ? this.loginForm.value.username ?? '' : '',
    };
    localStorage.setItem('rememberme', JSON.stringify(rememberme));
  }

  isError(field: string, error: string) {
    return this.loginForm.get(field)?.hasError(error) && this.loginForm.get(field)?.touched;
  }
}

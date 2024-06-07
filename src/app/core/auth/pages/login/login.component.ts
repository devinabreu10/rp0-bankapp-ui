import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CheckboxModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {}

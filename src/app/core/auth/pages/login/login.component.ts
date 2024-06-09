import { AsyncPipe, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ThemeService } from '../../../../shared/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CheckboxModule, NgStyle, AsyncPipe],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  theme$: Observable<string>;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }
}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../../shared/components/theme-toggle-button/theme-toggle-button.component';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}

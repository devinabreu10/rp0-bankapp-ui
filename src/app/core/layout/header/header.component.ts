import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  themePreference: string = localStorage.getItem('themePreference') ?? 'auto';
  isThemeSwitching: boolean = false;

  constructor(private themeService: ThemeService) {}

  toggleThemeSelection(): void {
    this.isThemeSwitching = !this.isThemeSwitching;
  }

  changeTheme(clickedTheme: string): void {
    this.themeService.toggleTheme(clickedTheme);
    this.themePreference = clickedTheme;
    this.isThemeSwitching = false;
  }
}

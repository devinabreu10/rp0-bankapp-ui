import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  theme: string = localStorage.getItem('themePreference') ?? 'auto';
  isThemeSwitching: boolean = false;
  prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  toggleThemeSelection(): void {
    this.isThemeSwitching = !this.isThemeSwitching;
  }

  changeTheme(clickedTheme: string): void {
    const themeValue =
      clickedTheme === 'dark' || (clickedTheme === 'auto' && this.prefersDark)
        ? 'dark'
        : 'light';
    document.documentElement.setAttribute('data-theme', themeValue);
    this.theme = clickedTheme;
    localStorage.setItem('themePreference', this.theme);
    this.isThemeSwitching = false;
  }
}

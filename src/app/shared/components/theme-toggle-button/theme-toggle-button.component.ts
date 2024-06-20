import { Component, ElementRef } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'theme-toggle-button',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './theme-toggle-button.component.html',
})
export class ThemeToggleButtonComponent {
  themePreference: string = localStorage.getItem('themePreference') ?? 'auto';
  isThemeSwitching: boolean = false;
  divStyles = {};

  constructor(
    private themeService: ThemeService,
    private elRef: ElementRef,
  ) {}

  toggleThemeSelection(): void {
    this.isThemeSwitching = !this.isThemeSwitching;

    if (this.isThemeSwitching) {
      const button: HTMLButtonElement = this.elRef.nativeElement.querySelector('button');
      const rect: DOMRect = button.getBoundingClientRect();

      this.divStyles = {
        position: 'absolute',
        top: `${rect.bottom + (window.scrollY + 5)}px`,
        left: `${rect.left + (window.scrollX - 50)}px`,
      };
    }
  }

  changeTheme(clickedTheme: string): void {
    this.themeService.toggleTheme(clickedTheme);
    this.themePreference = clickedTheme;
    this.isThemeSwitching = false;
  }
}

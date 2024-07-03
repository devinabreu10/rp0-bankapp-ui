import { Component, ElementRef, HostListener } from '@angular/core';
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

  /**
   * This method is a host listener that listens for clicks on the entire document.
   * If the click is not on the theme toggle button component, it sets the isThemeSwitching
   * variable to false, effectively closing the theme selection dropdown.
   *
   * @param {Event} event - The click event that triggered the host listener.
   * @return {void} This method does not return anything.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isThemeSwitching = false;
    }
  }
}

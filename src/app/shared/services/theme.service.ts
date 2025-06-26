import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  dataTheme: string = document.documentElement.getAttribute('data-theme') ?? 'light';
  prefersDark: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  private readonly themeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.dataTheme);
  theme$: Observable<string> = this.themeSubject.asObservable();

  /**
   * Toggles the theme based on user theme preference.
   *
   * @param {string} themePreference - The preference for the theme. Can be 'light', 'dark', or 'auto'.
   */
  toggleTheme(themePreference: string): void {
    const theme: Theme =
      themePreference === 'dark' || (themePreference === 'auto' && this.prefersDark)
        ? 'dark'
        : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('themePreference', themePreference);
    this.themeSubject.next(theme);
  }
}

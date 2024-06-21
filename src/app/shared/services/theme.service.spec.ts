import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change theme to dark when prefers dark', () => {
    spyOn(localStorage, 'setItem');
    service.prefersDark = true;

    service.toggleTheme('auto');

    expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('themePreference', 'auto');
  });

  it('should change theme to light when prefers light', () => {
    spyOn(localStorage, 'setItem');
    service.prefersDark = false;

    service.toggleTheme('auto');

    expect(document.documentElement.getAttribute('data-theme')).toEqual('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('themePreference', 'auto');
  });

  it('should change theme to dark when themePreference is dark', () => {
    spyOn(localStorage, 'setItem');

    service.toggleTheme('dark');

    expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('themePreference', 'dark');
  });

  it('should change theme to dark when themePreference is light', () => {
    spyOn(localStorage, 'setItem');

    service.toggleTheme('light');

    expect(document.documentElement.getAttribute('data-theme')).toEqual('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('themePreference', 'light');
  });
});

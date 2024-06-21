import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleButtonComponent } from './theme-toggle-button.component';
import { NgClass, NgStyle } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ElementRef } from '@angular/core';

class MockElementRef implements ElementRef {
  nativeElement = {};
}

describe('ThemeToggleButtonComponent', () => {
  let component: ThemeToggleButtonComponent;
  let fixture: ComponentFixture<ThemeToggleButtonComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);

    await TestBed.configureTestingModule({
      imports: [ThemeToggleButtonComponent, NgClass, NgStyle],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: ElementRef, useValue: MockElementRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleButtonComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme selection', () => {
    expect(component.isThemeSwitching).toBeFalsy();

    component.toggleThemeSelection();
    expect(component.isThemeSwitching).toBeTruthy();

    component.toggleThemeSelection();
    expect(component.isThemeSwitching).toBeFalsy();
  });

  it('should toggle theme selection and set divStyles when isThemeSwitching is true', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    spyOn(button, 'getBoundingClientRect').and.returnValue({
      bottom: 100, left: 200, height: 0, width: 0, x: 0, y: 0, right: 0, top: 0,
      toJSON: function () {},
    });

    component.toggleThemeSelection();

    expect(component.isThemeSwitching).toBe(true);
    expect(component.divStyles).toEqual({
      position: 'absolute',
      top: '105px', // 100 + 5
      left: '150px', // 200 - 50
    });
  });

  it('should close theme switcher on changeTheme', () => {
    component.isThemeSwitching = true;
    component.changeTheme('light');
    expect(component.isThemeSwitching).toBe(false);
    expect(component.themePreference).toBe('light');
    expect(themeService.toggleTheme).toHaveBeenCalledWith('light');
  });
});

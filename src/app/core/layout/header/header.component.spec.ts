import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { AuthService } from '../../auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { UserAuth } from '../../auth/user-auth.model';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNGConfig } from 'primeng/api';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;
  let currentUserSubject: BehaviorSubject<UserAuth | null>;

  const mockUser: UserAuth = {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    username: 'johndoe',
    token: 'fake-jwt-token',
  };

  beforeEach(async () => {
    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    currentUserSubject = new BehaviorSubject<UserAuth | null>(null);

    authServiceMock = jasmine.createSpyObj('AuthService', ['logout'], {
      isAuthenticated: isAuthenticatedSubject.asObservable(),
      currentUser: currentUserSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        NoopAnimationsModule, // Required for PrimeNG animations
      ],
      providers: [
        provideHttpClient(),
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceMock },
        PrimeNGConfig,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login/signup options when user is not authenticated', () => {
    isAuthenticatedSubject.next(false);
    fixture.detectChanges();

    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    const signUpLink = fixture.debugElement.query(By.css('a[routerLink="/sign-up"]'));

    expect(loginLink).withContext('Login link should be displayed').toBeTruthy();
    expect(signUpLink).withContext('Sign Up link should be displayed').toBeTruthy();
  });

  it('should display user menu when user is authenticated', () => {
    isAuthenticatedSubject.next(true);
    currentUserSubject.next(mockUser);
    fixture.detectChanges();

    const userIcon = fixture.debugElement.query(By.css('.pi-user'));
    const tieredMenu = fixture.debugElement.query(By.css('p-tieredMenu'));

    expect(userIcon)
      .withContext('User icon should be present when authenticated')
      .toBeTruthy();
    expect(tieredMenu)
      .withContext('Tiered menu should be present when authenticated')
      .toBeTruthy();
  });

  it('should call logout method when logout is triggered', () => {
    // Directly call the logout method
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should format user name correctly when full name is short', () => {
    const shortNameUser: UserAuth = {
      ...mockUser,
      firstName: 'John',
      lastName: 'Doe',
    };

    const result = component.setUserFullName(shortNameUser);
    expect(result).toBe('John Doe');
  });

  it('should format user name correctly when full name is long', () => {
    const longNameUser: UserAuth = {
      ...mockUser,
      firstName: 'Christopher',
      lastName: 'Montgomery',
    };

    const result = component.setUserFullName(longNameUser);
    expect(result).toBe('Christopher M.');
  });

  it('should have correct menu items structure', () => {
    expect(component.items?.length).toBe(4);

    // Check top-level menu items
    const topLevelItems = component.items || [];
    expect(topLevelItems[0].label).toBe('Accounts');
    expect(topLevelItems[1].label).toBe('Transactions');
    expect(topLevelItems[2].label).toBe('My Profile');
    expect(topLevelItems[3].label).toBe('Logout');

    // Check submenu items
    const accountSubmenu = topLevelItems[0].items || [];
    expect(accountSubmenu.length).toBe(3);
    expect(accountSubmenu[0].label).toBe('Manage Accounts');
    expect(accountSubmenu[1].label).toBe('Open Account');
    expect(accountSubmenu[2].label).toBe('Remove Account');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    // Create spies for Router and AuthService
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Create a BehaviorSubject to control the isAuthenticated value
    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    // Create a mock AuthService with the isAuthenticated property
    authServiceMock = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: isAuthenticatedSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section with correct title', () => {
    const compiled = fixture.nativeElement;
    const heroTitle = compiled.querySelector('h1.font-logo');
    expect(heroTitle.textContent).toContain('Banking Reimagined');
  });

  describe('navigateGetStarted', () => {
    it('should navigate to /accounts when user is authenticated', () => {
      isAuthenticatedSubject.next(true);

      component.navigateGetStarted();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['accounts']);
    });

    it('should navigate to /login when user is not authenticated', () => {
      isAuthenticatedSubject.next(false);

      component.navigateGetStarted();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should handle subscription completion', () => {
      component.navigateGetStarted();

      isAuthenticatedSubject.complete();

      // Verify the method doesn't throw errors when the observable completes
      expect(() => {
        // Try to trigger another navigation
        isAuthenticatedSubject.next(true);
      }).not.toThrow();
    });

    it('should be called when Get Started button is clicked', () => {
      spyOn(component, 'navigateGetStarted');

      // Find the button with text "Get Started"
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const getStartedButton = buttons.find(
        (button) => button.nativeElement.textContent.trim() === 'Get Started',
      );

      // Click the button
      getStartedButton?.nativeElement.click();

      // Verify the method was called
      expect(component.navigateGetStarted).toHaveBeenCalled();
    });
  });

  describe('navigateLearnMore', () => {
    it('should navigate to /about-us', () => {
      component.navigateLearnMore();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['about-us']);
    });

    it('should be called when Learn More button is clicked', () => {
      // Spy on the component method
      spyOn(component, 'navigateLearnMore');

      // Find the button with text "Learn More"
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const learnMoreButton = buttons.find(
        (button) => button.nativeElement.textContent.trim() === 'Learn More',
      );

      // Click the button
      learnMoreButton?.nativeElement.click();

      // Verify the method was called
      expect(component.navigateLearnMore).toHaveBeenCalled();
    });
  });

  describe('navigateOpenAccount', () => {
    it('should navigate to /accounts when user is authenticated', () => {
      isAuthenticatedSubject.next(true);

      component.navigateOpenAccount();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['accounts']);
    });

    it('should navigate to /sign-up when user is not authenticated', () => {
      isAuthenticatedSubject.next(false);

      component.navigateOpenAccount();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['sign-up']);
    });

    it('should handle subscription completion', () => {
      component.navigateOpenAccount();

      isAuthenticatedSubject.complete();

      // Verify the method doesn't throw errors when the observable completes
      expect(() => {
        // Try to trigger another navigation
        isAuthenticatedSubject.next(true);
      }).not.toThrow();
    });

    it('should be called when Open an Account Today button is clicked', () => {
      // Spy on the component method
      spyOn(component, 'navigateOpenAccount');

      // Find the button with text "Open an Account Today"
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const openAccountButton = buttons.find(
        (button) => button.nativeElement.textContent.trim() === 'Open an Account Today',
      );

      // Click the button
      openAccountButton?.nativeElement.click();

      // Verify the method was called
      expect(component.navigateOpenAccount).toHaveBeenCalled();
    });
  });
});

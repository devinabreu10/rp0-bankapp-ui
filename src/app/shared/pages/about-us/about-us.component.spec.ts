import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsComponent } from './about-us.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    authServiceMock = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: isAuthenticatedSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [AboutUsComponent],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to contact-us when navigateContactUs is called', () => {
    component.navigateContactUs();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['contact-us']);
  });

  it('should navigate to accounts if authenticated when navigateOpenAccount is called', () => {
    isAuthenticatedSubject.next(true);

    component.navigateOpenAccount();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['accounts']);
  });

  it('should navigate to login if not authenticated when navigateOpenAccount is called', () => {
    isAuthenticatedSubject.next(false);

    component.navigateOpenAccount();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAccountComponent } from './open-account.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AccountType } from '../../models/account-type.enum';
import { Account } from '../../models/account.model';
import { of, throwError } from 'rxjs';

describe('OpenAccountComponent', () => {
  let component: OpenAccountComponent;
  let fixture: ComponentFixture<OpenAccountComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['saveAccount']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OpenAccountComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and setup open new account form on init', () => {
    expect(component).toBeTruthy();
    expect(authServiceSpy.getUserId).toHaveBeenCalled();
    expect(component.accountTypes).toEqual([AccountType.CHECKING, AccountType.SAVINGS]);
    expect(component.openAccountForm).toBeTruthy();
  });

  it('should open new account and navigate to account dashboard on submit', () => {
    // Arrange
    const userId = 1;
    const account: Partial<Account> = {
      nickname: '',
      accountType: AccountType.CHECKING,
      accountBalance: 1000.0,
      customerId: userId,
    };
    authServiceSpy.getUserId.and.returnValue(userId);
    accountServiceSpy.saveAccount.and.returnValue(of(account as Account));
    component.openAccountForm.patchValue({
      accountType: AccountType.CHECKING,
      accountBalance: 1000.0,
    });

    // Act
    component.onSubmit();

    // Assert
    expect(accountServiceSpy.saveAccount).toHaveBeenCalledWith({
      nickname:'',
      accountType: AccountType.CHECKING,
      accountBalance: 1000.0,
      customerId: component.customerId,
    } as Account);
    expect(component.submitting).toBeFalse();
  });

  it('should catch error on submit', () => {
    // Arrange
    accountServiceSpy.saveAccount.and.returnValue(
      throwError(() => new Error('Failed to create account')),
    );
    component.openAccountForm.patchValue({
      accountType: AccountType.CHECKING,
      accountBalance: 1000.0,
    });

    // Act
    component.onSubmit();

    // Assert
    expect(component.submitting).toBeFalse();
  });

  it('should set isInvalidAndTouched to false if control is invalid', () => {
    // Arrange
    const controlName = '';

    // Act
    const result: boolean = component.isInvalidAndTouched(controlName);

    // Assert
    expect(component.openAccountForm.get(controlName)?.invalid).toBeUndefined();
    expect(component.openAccountForm.get(controlName)?.touched).toBeUndefined();
    expect(result).toBeFalse();
  });
});

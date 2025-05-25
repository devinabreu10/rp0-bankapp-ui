import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AccountDashboardComponent } from './account-dashboard.component';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Account } from '../../models/account.model';
import { AccountType } from '../../models/account-type.enum';
import routes from '../../account.routes';

describe('AccountDashboardComponent', () => {
  let component: AccountDashboardComponent;
  let fixture: ComponentFixture<AccountDashboardComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockAccounts: Account[] = [
    {
      accountNumber: 123456,
      accountType: AccountType.CHECKING,
      accountBalance: 1000,
      customerId: 1,
    },
    {
      accountNumber: 789012,
      accountType: AccountType.SAVINGS,
      accountBalance: 5000,
      customerId: 1,
    },
  ];

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['getAccountsByUsername']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsername']);

    await TestBed.configureTestingModule({
      imports: [AccountDashboardComponent],
      providers: [
        provideRouter(routes),
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    authServiceSpy.getUsername.and.returnValue('testuser');
    accountServiceSpy.getAccountsByUsername.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch accounts on init', () => {
    const username = 'testuser';
    authServiceSpy.getUsername.and.returnValue(username);
    accountServiceSpy.getAccountsByUsername.and.returnValue(of(mockAccounts));

    fixture.detectChanges();

    expect(authServiceSpy.getUsername).toHaveBeenCalled();
    expect(accountServiceSpy.getAccountsByUsername).toHaveBeenCalledWith(username);
    expect(component.accounts).toEqual(mockAccounts);
  });

  it('should display accounts when data is available', () => {
    authServiceSpy.getUsername.and.returnValue('testuser');
    accountServiceSpy.getAccountsByUsername.and.returnValue(of(mockAccounts));

    fixture.detectChanges();

    const accountElements = fixture.debugElement.queryAll(By.css('section'));
    expect(accountElements.length).toBe(2);

    // Check first account display
    const firstAccount = accountElements[0];
    expect(firstAccount.nativeElement.textContent).toContain('Checking Account');
    expect(firstAccount.nativeElement.textContent).toContain('123456');
    expect(firstAccount.nativeElement.textContent).toContain('$1,000.00');

    // Check second account display
    const secondAccount = accountElements[1];
    expect(secondAccount.nativeElement.textContent).toContain('Savings Account');
    expect(secondAccount.nativeElement.textContent).toContain('789012');
    expect(secondAccount.nativeElement.textContent).toContain('$5,000.00');
  });

  it('should display "No accounts found" when no accounts are available', () => {
    authServiceSpy.getUsername.and.returnValue('testuser');
    accountServiceSpy.getAccountsByUsername.and.returnValue(of([]));

    fixture.detectChanges();

    const noAccountsElement = fixture.debugElement.query(By.css('.px-6.py-8.text-center'));
    expect(noAccountsElement).toBeTruthy();
    expect(noAccountsElement.nativeElement.textContent).toContain('No accounts found');
  });
});

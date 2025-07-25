import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { AccountDetailsComponent } from './account-details.component';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';
import { AccountType } from '../../models/account-type.enum';
import routes from '../../account.routes';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;

  const mockAccount: Account = {
    accountNumber: 123456,
    accountType: AccountType.CHECKING,
    accountBalance: 1000,
    customerId: 1,
  };

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'getAccountByAcctNo',
      'deleteAccount',
    ]);

    await TestBed.configureTestingModule({
      imports: [AccountDetailsComponent],
      providers: [
        provideRouter(routes),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { accountNumber: '123456' },
              paramMap: convertToParamMap({ accountNumber: '123456' }),
            },
          },
        },
        { provide: AccountService, useValue: accountServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    accountServiceSpy.getAccountByAcctNo.and.returnValue(of(mockAccount));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch account details on init', () => {
    accountServiceSpy.getAccountByAcctNo.and.returnValue(of(mockAccount));

    fixture.detectChanges();

    expect(accountServiceSpy.getAccountByAcctNo).toHaveBeenCalled();
    expect(component.account).toEqual(mockAccount);
  });

  it('should display account details correctly', () => {
    accountServiceSpy.getAccountByAcctNo.and.returnValue(of(mockAccount));

    fixture.detectChanges();

    // Check account type display
    const accountTypeElement = fixture.debugElement.query(By.css('.bg-gray-100 h2'));
    expect(accountTypeElement.nativeElement.textContent).toContain('Checking Account');

    // Check account number display
    const accountNumberElement = fixture.debugElement.query(
      By.css('.grid-cols-2 > div:first-child p:last-child'),
    );
    expect(accountNumberElement.nativeElement.textContent).toContain('123456');

    // Check account balance display
    const accountBalanceElement = fixture.debugElement.query(By.css('.text-3xl.font-bold'));
    expect(accountBalanceElement.nativeElement.textContent).toContain('$1,000.00');
  });

  it('should navigate back to dashboard when back button is clicked', () => {
    accountServiceSpy.getAccountByAcctNo.and.returnValue(of(mockAccount));
    fixture.detectChanges();

    const backButton = fixture.debugElement.query(By.css('button[routerLink="/accounts"]'));
    expect(backButton.nativeElement.textContent).toContain('Dashboard');

    backButton.nativeElement.click();

    // Since we're using routerLink, we need to check if the link is correct
    expect(backButton.attributes['routerLink']).toBe('/accounts');
  });

  describe('closeAccount', () => {
    beforeEach(() => {
      component.account = mockAccount;
      component.showCloseDialog = true;
    });

    it('should call deleteAccount with correct account number', () => {
      // Arrange
      accountServiceSpy.deleteAccount.and.returnValue(of('success'));

      // Act
      component.closeAccount();

      // Assert
      expect(accountServiceSpy.deleteAccount).toHaveBeenCalledWith(mockAccount.accountNumber);
    });

    it('should handle error and show error message', () => {
      // Arrange
      const error = new Error('Failed to close account');
      accountServiceSpy.deleteAccount.and.returnValue(throwError(() => error));

      // Act
      component.closeAccount();

      // Assert
      expect(component.showCloseDialog).toBeFalse();
    });
  });
});

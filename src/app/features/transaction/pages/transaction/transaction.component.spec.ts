import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponent } from './transaction.component';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { TransactionService } from '../../services/transaction.service';
import { TransactionType } from '../../models/transaction-type.enum';
import { Transaction } from '../../models/transaction.model';
import { AccountService } from '../../../account/services/account.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Account } from '../../../account/models/account.model';
import { AccountType } from '../../../account/models/account-type.enum';
import { of, throwError } from 'rxjs';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['saveTransaction']);
    accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'transferFunds',
      'depositFunds',
      'withdrawFunds',
      'getAccountsByUsername',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsername']);

    await TestBed.configureTestingModule({
      imports: [TransactionComponent],
      providers: [
        provideHttpClient(),
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize transaction form with default values', () => {
    // Mock user accounts
    const mockAccounts: Account[] = [
      { accountNumber: 12345678, nickname: 'Savings', accountType: AccountType.SAVINGS, accountBalance: 1000, customerId: 1 },
      { accountNumber: 87654321, nickname: 'Checking', accountType: AccountType.CHECKING, accountBalance: 500, customerId: 1 }
    ];
    
    authServiceSpy.getUsername.and.returnValue('testuser');
    accountServiceSpy.getAccountsByUsername.and.returnValue(of(mockAccounts));
    
    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(component.transactionForm).toBeDefined();
    expect(component.accountOptions.length).toBe(2);
    expect(component.accountOptions[0].label).toContain('12345678');
    expect(component.accountOptions[0].label).toContain('Savings');
    expect(component.accountOptions[0].label).toContain('$1000.00');
  });

  it('should listen for changes in transaction type', () => {
    // Mock user accounts first
    const mockAccounts: Account[] = [
      { accountNumber: 12345678, nickname: 'Savings', accountType: AccountType.SAVINGS, accountBalance: 1000, customerId: 1 },
      { accountNumber: 87654321, nickname: 'Checking', accountType: AccountType.CHECKING, accountBalance: 500, customerId: 1 }
    ];
    
    authServiceSpy.getUsername.and.returnValue('testuser');
    accountServiceSpy.getAccountsByUsername.and.returnValue(of(mockAccounts));
    component.ngOnInit();
    
    component.transactionForm.get('type')?.setValue(TransactionType.ACCOUNT_TRANSFER);
    fixture.detectChanges(); // Trigger change detection (onInit will be called)
    expect(component.transactionForm.get('toAccountNumber')?.value).toBeDefined();
    expect(component.transactionForm.get('type')?.value).toBe(
      TransactionType.ACCOUNT_TRANSFER,
    );

    component.transactionForm.get('type')?.setValue(TransactionType.ACCOUNT_WITHDRAW);
    fixture.detectChanges();
    expect(component.transactionForm.get('toAccountNumber')?.value).toBeUndefined();
    expect(component.transactionForm.get('type')?.value).toBe(
      TransactionType.ACCOUNT_WITHDRAW,
    );
  });

  it('should validate same account selection for transfers', () => {
    // Mock user accounts first
    const mockAccounts: Account[] = [
      { accountNumber: 12345678, nickname: 'Savings', accountType: AccountType.SAVINGS, accountBalance: 1000, customerId: 1 },
      { accountNumber: 87654321, nickname: 'Checking', accountType: AccountType.CHECKING, accountBalance: 500, customerId: 1 }
    ];
    
    authServiceSpy.getUsername.and.returnValue('testuser');
    accountServiceSpy.getAccountsByUsername.and.returnValue(of(mockAccounts));
    component.ngOnInit();
    
    // Set up transfer
    component.transactionForm.get('type')?.setValue(TransactionType.ACCOUNT_TRANSFER);
    component.transactionForm.get('accountNumber')?.setValue(12345678);
    component.transactionForm.get('toAccountNumber')?.setValue(12345678);
    
    expect(component.transactionForm.get('toAccountNumber')?.hasError('sameAccount')).toBe(true);
    
    // Change to different account
    component.transactionForm.get('toAccountNumber')?.setValue(87654321);
    expect(component.transactionForm.get('toAccountNumber')?.hasError('sameAccount')).toBe(false);
  });

  it('should deposit funds when form is submitted', () => {
    // Arrange
    const transactionDeposit: Partial<Transaction> = {
      transactionType: TransactionType.ACCOUNT_DEPOSIT,
      transactionAmount: 100.0,
      transactionNotes: 'Test notes',
      accountNumber: 1,
    };
    component.transactionForm.patchValue(transactionDeposit);
    accountServiceSpy.depositFunds.and.returnValue(of(''));
    component.onSubmit();

    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.depositFunds).toHaveBeenCalled();
  });

  it('should throw error when trying to deposit funds', () => {
    // Arrange
    spyOn(console, 'error');
    const transactionDeposit: Partial<Transaction> = {
      transactionType: TransactionType.ACCOUNT_DEPOSIT,
      transactionAmount: 100.0,
      transactionNotes: 'Test notes',
      accountNumber: 1,
    };

    component.transactionForm.patchValue(transactionDeposit);
    accountServiceSpy.depositFunds.and.returnValue(
      throwError(() => new Error('Error completing deposit')),
    );
    component.onSubmit();

    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.depositFunds).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error completing deposit',
      new Error('Error completing deposit'),
    );
  });

  it('should withdraw funds when form is submitted', () => {
    // Arrange
        component.transactionForm.patchValue({
      type: TransactionType.ACCOUNT_WITHDRAW,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    });

    accountServiceSpy.withdrawFunds.and.returnValue(of(''));
    component.onSubmit();
    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.withdrawFunds).toHaveBeenCalled();
  });

  it('should throw error when trying to withdraw funds', () => {
    // Arrange
    spyOn(console, 'error');

    component.transactionForm.patchValue({
      type: TransactionType.ACCOUNT_WITHDRAW,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    });

    accountServiceSpy.withdrawFunds.and.returnValue(
      throwError(() => new Error('Error completing withdrawal')),
    );
    component.onSubmit();

    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.withdrawFunds).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error completing withdrawal',
      new Error('Error completing withdrawal'),
    );
  });

  it('should throw 409 error when trying to withdraw funds', () => {
    // Arrange
    spyOn(console, 'error');
    component.transactionForm.patchValue({
      type: TransactionType.ACCOUNT_WITHDRAW,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    });

    accountServiceSpy.withdrawFunds.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({ status: 409, error: 'Insufficient funds for withdrawal' }),
      ),
    );
    component.onSubmit();

    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.withdrawFunds).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error completing withdrawal',
      new HttpErrorResponse({ status: 409, error: 'Insufficient funds for withdrawal' }),
    );
  });

  it('should transfer funds when form is submitted', () => {
    // Arrange
    component.transactionForm.patchValue({
      type: TransactionType.ACCOUNT_TRANSFER,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    });

    accountServiceSpy.transferFunds.and.returnValue(of(''));
    component.onSubmit();
    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.transferFunds).toHaveBeenCalled();
  });

  it('should throw error when trying to transfer funds', () => {
    // Arrange
    spyOn(console, 'error');
    component.transactionForm.patchValue({
      type: TransactionType.ACCOUNT_TRANSFER,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    });

    accountServiceSpy.transferFunds.and.returnValue(
      throwError(() => new Error('Error completing transfer')),
    );
    component.onSubmit();

    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.transferFunds).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error completing transfer',
      new Error('Error completing transfer'),
    );
  });

  it('should throw 409 error when trying to transfer funds', () => {
    // Arrange
    spyOn(console, 'error');
    component.transactionForm.patchValue({
      type: TransactionType.ACCOUNT_TRANSFER,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    });

    accountServiceSpy.transferFunds.and.returnValue(
      throwError(
        () => new HttpErrorResponse({ status: 409, error: 'Insufficient funds for transfer' }),
      ),
    );
    component.onSubmit();

    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.transferFunds).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error completing transfer',
      new HttpErrorResponse({ status: 409, error: 'Insufficient funds for transfer' }),
    );
  });

  it('should set isInvalidAndTouched to false if control is invalid', () => {
    // Arrange
    const controlName = '';

    // Act
    const result: boolean = component.isInvalidAndTouched(controlName);

    // Assert
    expect(component.transactionForm.get(controlName)?.invalid).toBeUndefined();
    expect(component.transactionForm.get(controlName)?.touched).toBeUndefined();
    expect(result).toBeFalse();
  });

  it('should handle error when loading user accounts fails', () => {
    // Arrange
    spyOn(console, 'error');
    const error = new Error('Failed to load user accounts');
    authServiceSpy.getUsername.and.returnValue('testuser');
    accountServiceSpy.getAccountsByUsername.and.returnValue(throwError(() => error));
    const messageService = fixture.debugElement.injector.get<any>(component["messageService"].constructor);
    spyOn(messageService, 'add');

    // Act
    component.loadUserAccounts();

    // Assert
    expect(console.error).toHaveBeenCalledWith('Error loading user accounts:', error);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load user accounts',
    });
    expect(component.isLoadingAccounts).toBeFalse();
  });
});

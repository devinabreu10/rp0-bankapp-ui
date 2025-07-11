import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponent } from './transaction.component';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { TransactionService } from '../../services/transaction.service';
import { TransactionType } from '../../models/transaction-type.enum';
import { Transaction } from '../../models/transaction.model';
import { AccountService } from '../../../account/services/account.service';
import { of, throwError } from 'rxjs';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['saveTransaction']);
    accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'transferFunds',
      'depositFunds',
      'withdrawFunds',
    ]);

    await TestBed.configureTestingModule({
      imports: [TransactionComponent],
      providers: [
        provideHttpClient(),
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: AccountService, useValue: accountServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize transaction form with default values', () => {
    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(component.transactionForm).toBeDefined();
    expect(component.transactionForm.value).toEqual({
      type: TransactionType.ACCOUNT_DEPOSIT,
      amount: 0.01,
      notes: '',
      accountNumber: 0,
    });
  });

  it('should listen for changes in transaction type', () => {
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

  it('should deposit funds when form is submitted', () => {
    // Arrange
    const transactionDeposit: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_DEPOSIT,
      amount: 100.0,
      notes: 'Test notes',
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
      type: TransactionType.ACCOUNT_DEPOSIT,
      amount: 100.0,
      notes: 'Test notes',
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
    const transactionWithdraw: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_WITHDRAW,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };
    component.transactionForm.patchValue(transactionWithdraw);
    accountServiceSpy.withdrawFunds.and.returnValue(of(''));
    component.onSubmit();
    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.withdrawFunds).toHaveBeenCalled();
  });

  it('should throw error when trying to withdraw funds', () => {
    // Arrange
    spyOn(console, 'error');
    const transactionWithdraw: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_WITHDRAW,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };

    component.transactionForm.patchValue(transactionWithdraw);
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
    const transactionWithdraw: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_WITHDRAW,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };

    component.transactionForm.patchValue(transactionWithdraw);
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
    const transactionTransfer: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_TRANSFER,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };
    component.transactionForm.patchValue(transactionTransfer);
    accountServiceSpy.transferFunds.and.returnValue(of(''));
    component.onSubmit();
    expect(component.transactionForm).toBeDefined();
    expect(accountServiceSpy.transferFunds).toHaveBeenCalled();
  });

  it('should throw error when trying to transfer funds', () => {
    // Arrange
    spyOn(console, 'error');
    const transactionTransfer: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_TRANSFER,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };

    component.transactionForm.patchValue(transactionTransfer);
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
    const transactionTransfer: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_TRANSFER,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };

    component.transactionForm.patchValue(transactionTransfer);
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
});

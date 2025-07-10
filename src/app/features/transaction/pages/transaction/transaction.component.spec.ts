import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponent } from './transaction.component';
import { provideHttpClient } from '@angular/common/http';
import { TransactionService } from '../../services/transaction.service';
import { TransactionType } from '../../models/transaction-type.enum';
import { Transaction } from '../../models/transaction.model';
import { AccountService } from '../../../account/services/account.service';

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

  it('should deposit, withdraw, and transfer funds when form is submitted', () => {
    // Arrange
    const transactionDeposit: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_DEPOSIT,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };
    component.transactionForm.patchValue(transactionDeposit);
    component.onSubmit();
    expect(component.transactionForm).toBeDefined();

    const transactionWithdraw: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_WITHDRAW,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };
    component.transactionForm.patchValue(transactionWithdraw);
    component.onSubmit();
    expect(component.transactionForm).toBeDefined();

    const transactionTransfer: Partial<Transaction> = {
      type: TransactionType.ACCOUNT_TRANSFER,
      amount: 100.0,
      notes: 'Test notes',
      accountNumber: 1,
    };
    component.transactionForm.patchValue(transactionTransfer);
    component.onSubmit();
    expect(component.transactionForm).toBeDefined();
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

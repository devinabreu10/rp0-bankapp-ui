import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionType } from '../../models/transaction-type.enum';
import { provideHttpClient } from '@angular/common/http';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let transactionService: TransactionService;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId']);
    mockAuthService.getUserId.and.returnValue(42);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TransactionHistoryComponent],
      providers: [
        { provide: TransactionService, useClass: TransactionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch transactions on init', () => {
    spyOn(transactionService, 'getTransactionsAndTransfersByCustomerId').and.returnValue(of([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Test Deposit Transaction', createdAt: new Date('2023-01-01'), accountNumber: 123456789 },
    ]));
    spyOn(component, 'fetchTransactions').and.callThrough();
    component.ngOnInit();
    expect(component.fetchTransactions).toHaveBeenCalled();
    expect(transactionService.getTransactionsAndTransfersByCustomerId).toHaveBeenCalledWith(42);
    expect(component.transactions().length).toBe(1);
    expect(component.loading()).toBeFalse();
  });

  it('should handle error during fetchTransactions', () => {
    spyOn(transactionService, 'getTransactionsAndTransfersByCustomerId').and.returnValue(throwError(() => new Error('fail')));
    component.fetchTransactions();
    expect(component.loading()).toBeFalse();
  });

  it('should filter transactions by type', () => {
    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Deposit', createdAt: new Date('2023-01-01'), accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Withdrawal', createdAt: new Date('2023-01-02'), accountNumber: 123 },
    ]);
    component.filterType.set(TransactionType.ACCOUNT_DEPOSIT);
    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].transactionType).toBe(TransactionType.ACCOUNT_DEPOSIT);
  });

  // it('should filter transactions by date', () => {
  //   component.transactions.set([
  //     { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Deposit', createdAt: new Date('2023-01-01'), accountNumber: 123 },
  //     { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Withdrawal', createdAt: new Date('2023-01-02'), accountNumber: 123 },
  //   ]);
  //   component.filterDate.set('2023-01-02');
  //   expect(component.filteredTransactions().length).toBe(1);
  //   expect(component.filteredTransactions()[0].createdAt.toISOString().slice(0, 10)).toBe('2023-01-02');
  // });

  it('should sort transactions by amount asc/desc', () => {
    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Deposit', createdAt: new Date('2023-01-01'), accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Withdrawal', createdAt: new Date('2023-01-02'), accountNumber: 123 },
    ]);
    component.sortField.set('transactionAmount');
    component.sortDirection.set('asc');
    let sorted = component.filteredTransactions();
    expect(sorted[0].transactionAmount).toBe(50);
    component.sortDirection.set('desc');
    sorted = component.filteredTransactions();
    expect(sorted[0].transactionAmount).toBe(100);
  });

  it('should paginate transactions', () => {
    const txns = Array.from({ length: 15 }, (_, i) => ({ transactionId: i + 1, transactionAmount: i, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: '', createdAt: new Date(), accountNumber: 123 }));
    component.transactions.set(txns);
    component.pageSize.set(10);
    component.page.set(2);
    expect(component.pagedTransactions().length).toBe(5);
  });

  it('should reset page on filter change', () => {
    component.page.set(3);
    component.onFilterChange();
    expect(component.page()).toBe(1);
  });

  it('should toggle sort direction or set new sort field', () => {
    component.sortField.set('transactionAmount');
    component.sortDirection.set('asc');
    component.onSort('transactionAmount');
    expect(component.sortDirection()).toBe('desc');
    component.onSort('createdAt');
    expect(component.sortField()).toBe('createdAt');
    expect(component.sortDirection()).toBe('desc');
  });

  it('should go to valid page', () => {
    component.transactions.set(Array.from({ length: 20 }, (_, i) => ({ transactionId: i + 1, transactionAmount: i, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: '', createdAt: new Date(), accountNumber: 123 })));
    component.pageSize.set(10);
    component.goToPage(2);
    expect(component.page()).toBe(2);
    component.goToPage(0);
    expect(component.page()).toBe(2);
    component.goToPage(3);
    expect(component.page()).toBe(2); // Only 2 pages
  });

  it('should navigate to transaction details', () => {
    const txn = { transactionId: 123, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: '', createdAt: new Date(), accountNumber: 123 } as Transaction;
    component.viewDetails(txn);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['transactions', 123]);
  });

  it('should navigate to add transaction', () => {
    component.goToAddTransaction();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['transactions/add']);
  });
});

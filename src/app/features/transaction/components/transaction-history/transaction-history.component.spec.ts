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

  it('should initialize with correct dropdown options', () => {
    expect(component.transactionTypeOptions).toEqual([
      { label: 'All Types', value: '' },
      { label: 'Deposit', value: 'Account Deposit' },
      { label: 'Withdraw', value: 'Account Withdraw' },
      { label: 'Transfer', value: 'Account Transfer' },
    ]);

    expect(component.dateRangeOptions).toEqual([
      { label: 'All Dates', value: '' },
      { label: 'Today', value: 'today' },
      { label: 'Last 7 Days', value: 'last7days' },
      { label: 'Last 30 Days', value: 'last30days' },
      { label: 'This Month', value: 'thisMonth' },
      { label: 'Last Month', value: 'lastMonth' },
    ]);
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

  it('should filter transactions by today date range', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Today', createdAt: today, accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Yesterday', createdAt: yesterday, accountNumber: 123 },
    ]);

    component.filterDateRange.set('today');
    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].transactionNotes).toBe('Today');
  });

  it('should filter transactions by last 7 days date range', () => {
    const today = new Date();
    const eightDaysAgo = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Recent', createdAt: threeDaysAgo, accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Old', createdAt: eightDaysAgo, accountNumber: 123 },
    ]);

    component.filterDateRange.set('last7days');
    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].transactionNotes).toBe('Recent');
  });

  it('should filter transactions by last 30 days date range', () => {
    const today = new Date();
    const thirtyOneDaysAgo = new Date(today.getTime() - 31 * 24 * 60 * 60 * 1000);
    const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000);

    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Recent', createdAt: fifteenDaysAgo, accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Old', createdAt: thirtyOneDaysAgo, accountNumber: 123 },
    ]);

    component.filterDateRange.set('last30days');
    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].transactionNotes).toBe('Recent');
  });

  it('should filter transactions by this month date range', () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 15);

    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'This Month', createdAt: thisMonth, accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Last Month', createdAt: lastMonth, accountNumber: 123 },
    ]);

    component.filterDateRange.set('thisMonth');
    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].transactionNotes).toBe('This Month');
  });

  it('should filter transactions by last month date range', () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 15);

    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'This Month', createdAt: thisMonth, accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Last Month', createdAt: lastMonth, accountNumber: 123 },
    ]);

    component.filterDateRange.set('lastMonth');
    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].transactionNotes).toBe('Last Month');
  });

  it('should apply multiple filters correctly', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Today Deposit', createdAt: today, accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Today Withdraw', createdAt: today, accountNumber: 123 },
      { transactionId: 3, transactionAmount: 75, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Yesterday Deposit', createdAt: yesterday, accountNumber: 123 },
    ]);

    component.filterType.set(TransactionType.ACCOUNT_DEPOSIT);
    component.filterDateRange.set('today');

    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].transactionNotes).toBe('Today Deposit');
  });

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

  it('should sort transactions by date', () => {
    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'First', createdAt: new Date('2023-01-01'), accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Second', createdAt: new Date('2023-01-02'), accountNumber: 123 },
    ]);
    component.sortField.set('createdAt');
    component.sortDirection.set('asc');
    let sorted = component.filteredTransactions();
    expect(sorted[0].transactionNotes).toBe('First');
    component.sortDirection.set('desc');
    sorted = component.filteredTransactions();
    expect(sorted[0].transactionNotes).toBe('Second');
  });

  it('should sort transactions by transaction type', () => {
    component.transactions.set([
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Deposit', createdAt: new Date('2023-01-01'), accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Withdrawal', createdAt: new Date('2023-01-02'), accountNumber: 123 },
    ]);
    component.sortField.set('transactionType');
    component.sortDirection.set('asc');
    let sorted = component.filteredTransactions();
    expect(sorted[0].transactionType).toBe(TransactionType.ACCOUNT_DEPOSIT);
    component.sortDirection.set('desc');
    sorted = component.filteredTransactions();
    expect(sorted[0].transactionType).toBe(TransactionType.ACCOUNT_WITHDRAW);
  });

  it('should paginate transactions', () => {
    const txns = Array.from({ length: 15 }, (_, i) => ({ transactionId: i + 1, transactionAmount: i, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: '', createdAt: new Date(), accountNumber: 123 }));
    component.transactions.set(txns);
    component.pageSize.set(10);
    component.page.set(2);
    expect(component.pagedTransactions().length).toBe(5);
  });

  it('should calculate total pages correctly', () => {
    const txns = Array.from({ length: 25 }, (_, i) => ({ transactionId: i + 1, transactionAmount: i, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: '', createdAt: new Date(), accountNumber: 123 }));
    component.transactions.set(txns);
    component.pageSize.set(10);
    expect(component.totalPages()).toBe(3);
  });

  it('should reset page on filter change', () => {
    component.page.set(3);
    component.onFilterChange();
    expect(component.page()).toBe(1);
  });

  it('should reset page on date range change', () => {
    component.page.set(3);
    component.onDateRangeChange();
    expect(component.page()).toBe(1);
  });

  it('should clear all filters', () => {
    component.filterType.set(TransactionType.ACCOUNT_DEPOSIT);
    component.filterDateRange.set('today');
    component.page.set(3);

    component.clearFilters();

    expect(component.filterType()).toBe('');
    expect(component.filterDateRange()).toBe('');
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
    expect(mockRouter.navigate).toHaveBeenCalledWith(['transactions', 'deposit', 123]);
  });

  it('should navigate to add transaction', () => {
    component.goToAddTransaction();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['transactions/add']);
  });

  it('should handle empty transactions array', () => {
    component.transactions.set([]);
    expect(component.filteredTransactions().length).toBe(0);
    expect(component.pagedTransactions().length).toBe(0);
    expect(component.totalPages()).toBe(1);
  });

  it('should handle edge case with no filters applied', () => {
    const txns = [
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Deposit', createdAt: new Date('2023-01-01'), accountNumber: 123 },
      { transactionId: 2, transactionAmount: 50, transactionType: TransactionType.ACCOUNT_WITHDRAW, transactionNotes: 'Withdrawal', createdAt: new Date('2023-01-02'), accountNumber: 123 },
    ];
    component.transactions.set(txns);
    component.filterType.set('');
    component.filterDateRange.set('');

    expect(component.filteredTransactions().length).toBe(2);
  });

  it('should handle invalid date range filter gracefully', () => {
    const txns = [
      { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Deposit', createdAt: new Date('2023-01-01'), accountNumber: 123 },
    ];
    component.transactions.set(txns);
    component.filterDateRange.set('invalid-range');

    // Should not filter anything when invalid range is provided
    expect(component.filteredTransactions().length).toBe(1);
  });
});

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  standalone: true,
  imports: [FormsModule, NgClass, CurrencyPipe, DatePipe, DropdownModule],
})
export class TransactionHistoryComponent implements OnInit {
  customerId: number = inject(AuthService).getUserId();

  // Signals for state
  transactions = signal<Transaction[]>([]);
  filterType = signal<string>('');
  filterDateRange = signal<string>('');
  sortField = signal<string>('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  page = signal<number>(1);
  pageSize = signal<number>(10);
  loading = signal<boolean>(false);

  // Dropdown options
  transactionTypeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Deposit', value: 'Account Deposit' },
    { label: 'Withdraw', value: 'Account Withdraw' },
    { label: 'Transfer', value: 'Account Transfer' },
  ];

  dateRangeOptions = [
    { label: 'All Dates', value: '' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
  ];

  // Computed signals for derived state
  filteredTransactions = computed(() => {
    return this.applyFilters();
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredTransactions().length / this.pageSize())),
  );

  pagedTransactions = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filteredTransactions().slice(start, start + this.pageSize());
  });

  constructor(
    private readonly transactionService: TransactionService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.loading.set(true);
    this.transactionService
      .getTransactionsAndTransfersByCustomerId(this.customerId)
      .subscribe({
        next: (txns: Transaction[]): void => {
          this.transactions.set(txns);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  applyFilters(): Transaction[] {
    let txns = [...this.transactions()];
    
    // Filter by transaction type
    if (this.filterType()) {
      txns = txns.filter((t) => t.transactionType === this.filterType());
    }
    
    // Filter by date range
    if (this.filterDateRange()) {
      const today = new Date();
      
      switch (this.filterDateRange()) {
        case 'today':
          txns = txns.filter((t) => {
            const txnDate = new Date(t.createdAt);
            return txnDate.toDateString() === today.toDateString();
          });
          break;
        case 'last7days':
          const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          txns = txns.filter((t) => {
            const txnDate = new Date(t.createdAt);
            return txnDate >= sevenDaysAgo;
          });
          break;
        case 'last30days':
          const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          txns = txns.filter((t) => {
            const txnDate = new Date(t.createdAt);
            return txnDate >= thirtyDaysAgo;
          });
          break;
        case 'thisMonth':
          const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          txns = txns.filter((t) => {
            const txnDate = new Date(t.createdAt);
            return txnDate >= thisMonthStart;
          });
          break;
        case 'lastMonth':
          const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
          txns = txns.filter((t) => {
            const txnDate = new Date(t.createdAt);
            return txnDate >= lastMonthStart && txnDate <= lastMonthEnd;
          });
          break;
      }
    }
    
    // Sorting
    txns.sort((a, b) => {
      let valA = a[this.sortField() as keyof Transaction];
      let valB = b[this.sortField() as keyof Transaction];
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();
      if (valA < valB) return this.sortDirection() === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection() === 'asc' ? 1 : -1;
      return 0;
    });

    return txns;
  }

  onFilterChange(): void {
    this.page.set(1);
  }

  onDateRangeChange(): void {
    this.page.set(1);
  }

  clearFilters(): void {
    this.filterType.set('');
    this.filterDateRange.set('');
    this.page.set(1);
  }

  onSort(field: string): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('desc');
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
  }

  viewDetails(txn: Transaction): void {
    this.router.navigate(['transactions', txn.transactionId]);
  }

  goToAddTransaction(): void {
    this.router.navigate(['transactions/add']);
  }
}

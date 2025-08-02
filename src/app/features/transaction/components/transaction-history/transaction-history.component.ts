import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  standalone: true,
  imports: [FormsModule, NgClass, CurrencyPipe, DatePipe],
})
export class TransactionHistoryComponent implements OnInit {
  customerId: number = inject(AuthService).getUserId();

  // Signals for state
  transactions = signal<Transaction[]>([]);
  filterType = signal<string>('');
  filterDate = signal<string>('');
  sortField = signal<string>('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  page = signal<number>(1);
  pageSize = signal<number>(10);
  loading = signal<boolean>(false);

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
    if (this.filterType()) {
      txns = txns.filter((t) => t.transactionType === this.filterType());
    }
    if (this.filterDate()) {
      txns = txns.filter((t) => t.createdAt.toString().slice(0, 10) === this.filterDate());
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

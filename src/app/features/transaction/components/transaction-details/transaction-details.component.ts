import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { UnifiedTransactionDetails } from '../../models/transaction.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
})
export class TransactionDetailsComponent implements OnInit {
  transaction!: UnifiedTransactionDetails;
  loading = true;
  errorMsg = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (type && id) {
      this.transactionService.getTransactionById(type, id).subscribe({
        next: (txn) => {
          console.log(txn);
          this.transaction = txn;
          this.loading = false;
        },
        error: () => {
          this.errorMsg = 'Transaction not found.';
          this.loading = false;
        },
      });
    } else {
      this.errorMsg = 'Invalid transaction.';
      this.loading = false;
    }
  }

  backToHistory(): void {
    this.router.navigate(['transactions']);
  }
}

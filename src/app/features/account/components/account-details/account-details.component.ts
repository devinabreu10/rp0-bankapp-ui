import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CloseAccountDialogComponent } from '../../../../shared/components/close-account-dialog.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, CloseAccountDialogComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './account-details.component.html'
})
export class AccountDetailsComponent implements OnInit {
  account!: Account;
  showCloseDialog: boolean = false;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAccountByAcctNo(this.activatedRoute.snapshot.params['accountNumber'])
      .subscribe((account: Account) => {
        this.account = account;
      });
  }

  closeAccount(): void {
    this.accountService.deleteAccount(this.account.accountNumber).subscribe({
      next: (status: string): void => {
        console.log(status);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account successfully closed',
        });
        setTimeout(() => {
          this.router.navigate(['accounts']);
        }, 1500);
      },
      error: (err) => {
        console.error('Failed to close account', err);
        this.showCloseDialog = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to close account. Please try again.',
        });
      },
      complete: (): void => {
        this.showCloseDialog = false;
      },
    });
  }
}

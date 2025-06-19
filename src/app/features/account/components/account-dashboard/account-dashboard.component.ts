import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  providers: [MessageService],
  templateUrl: './account-dashboard.component.html'
})
export class AccountDashboardComponent implements OnInit {
  accounts!: Account[];

  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const username: string = this.authService.getUsername();
    this.accountService.getAccountsByUsername(username).subscribe({
      next: (accounts: Account[]): void => {
        this.accounts = accounts;
      },
      error: (err: Error): void => {
        this.handleAccountError(err);
      },
    });
  }

  private handleAccountError(error: Error): void {
    const errorMessage = `Failed to load accounts: ${error.message}`;
    console.error(errorMessage, error);

    this.messageService.add({
      severity: 'error',
      summary: 'Account Loading Failed',
      detail: 'Unable to retrieve your accounts. Please try again later.',
    });
  }
}

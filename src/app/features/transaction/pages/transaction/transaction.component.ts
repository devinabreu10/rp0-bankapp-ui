import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { TransactionType } from '../../models/transaction-type.enum';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { NgClass } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { AccountService } from '../../../account/services/account.service';
import { AccountTxn } from '../../../account/models/account-txn.model';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Account } from '../../../account/models/account.model';

export interface TransactionForm {
  type: FormControl<TransactionType>;
  amount: FormControl<number>;
  notes: FormControl<string>;
  accountNumber: FormControl<number>;
  toAccountNumber?: FormControl<number | null>;
}

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    NgClass,
    InputTextareaModule,
    RippleModule
  ],
  providers: [MessageService],
  templateUrl: './transaction.component.html',
})
export class TransactionComponent implements OnInit {
  transactionForm!: FormGroup<TransactionForm>;
  transactionType = TransactionType; // Make enum available in template
  transactionTypes = [
    { label: 'Deposit', value: TransactionType.ACCOUNT_DEPOSIT },
    { label: 'Withdraw', value: TransactionType.ACCOUNT_WITHDRAW },
    { label: 'Transfer', value: TransactionType.ACCOUNT_TRANSFER },
  ];

  // User accounts for dropdowns
  userAccounts: Account[] = [];
  accountOptions: { label: string; value: number }[] = [];
  isLoadingAccounts = false;

  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadUserAccounts();
    this.initForm();
  }

  loadUserAccounts(): void {
    this.isLoadingAccounts = true;
    const username = this.authService.getUsername();
    
    if (!username) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not authenticated',
      });
      this.isLoadingAccounts = false;
      return;
    }

    this.accountService.getAccountsByUsername(username).subscribe({
      next: (accounts: Account[]) => {
        this.userAccounts = accounts;
        this.accountOptions = accounts.map(account => ({
          label: `${account.accountNumber}${account.nickname ? ` - ${account.nickname}` : ''} ($${account.accountBalance.toFixed(2)})`,
          value: account.accountNumber
        }));
        this.isLoadingAccounts = false;
        
        // Set default account if form is initialized
        if (this.transactionForm && this.accountOptions.length > 0) {
          this.transactionForm.patchValue({
            accountNumber: this.accountOptions[0].value
          });
        }
      },
      error: (error) => {
        console.error('Error loading user accounts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user accounts',
        });
        this.isLoadingAccounts = false;
      }
    });
  }

  initForm(): void {
    this.transactionForm = new FormGroup<TransactionForm>({
      type: new FormControl(TransactionType.ACCOUNT_DEPOSIT, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      amount: new FormControl(0.01, {
        validators: [
          Validators.required,
          Validators.min(0.01),
          Validators.max(999999999999.99),
        ],
        nonNullable: true,
      }),
      notes: new FormControl('', {
        nonNullable: true,
      }),
      accountNumber: new FormControl(0, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

    // Listen for changes in transaction type
    this.transactionForm.get('type')?.valueChanges.subscribe((type: TransactionType): void => {
      if (type === TransactionType.ACCOUNT_TRANSFER) {
        this.transactionForm.addControl(
          'toAccountNumber',
          new FormControl<number | null>(null, {
            validators: [Validators.required],
            nonNullable: true,
          }),
        );
        // Add validation to prevent same account selection
        this.addTransferValidation();
      } else if (this.transactionForm.get('toAccountNumber')) {
        this.transactionForm.removeControl('toAccountNumber');
      }
    });

    // Listen for changes in account numbers to validate transfers
    this.transactionForm.get('accountNumber')?.valueChanges.subscribe(() => {
      if (this.transactionForm.get('type')?.value === TransactionType.ACCOUNT_TRANSFER) {
        this.validateTransferAccounts();
      }
    });
  }

  onSubmit(): void {
    const formValue = this.transactionForm.value;

    const transaction: Partial<Transaction> = {
      transactionType: formValue.type as TransactionType,
      transactionAmount: formValue.amount as number,
      transactionNotes: formValue.notes as string,
      accountNumber: formValue.accountNumber!,
    };

    console.log('Transaction submitted:', transaction);

    switch (transaction.transactionType) {
      case TransactionType.ACCOUNT_DEPOSIT:
        this.accountDeposit(transaction);
        break;

      case TransactionType.ACCOUNT_WITHDRAW:
        this.accountWithdraw(transaction);
        break;

      case TransactionType.ACCOUNT_TRANSFER:
        this.accountTransfer(transaction);
        break;
    }
  }

  accountDeposit(transaction: Partial<Transaction>): void {
    const depositRequest: AccountTxn = {
      sourceAccountNumber: transaction.accountNumber as number,
      amount: transaction.transactionAmount as number,
      notes: transaction.transactionNotes as string,
    };
    this.accountService.depositFunds(depositRequest).subscribe({
      next: (responseMessage: string) => {
        console.log('Account deposit successful!', responseMessage);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Deposit completed successfully',
        });
        this.resetForm();
      },
      error: (error) => {
        console.error('Error completing deposit', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to complete deposit',
        });
      },
    });
  }

  private accountWithdraw(transaction: Partial<Transaction>) {
    const withdrawRequest: AccountTxn = {
      sourceAccountNumber: transaction.accountNumber as number,
      amount: transaction.transactionAmount as number,
      notes: transaction.transactionNotes as string,
    };
    this.accountService.withdrawFunds(withdrawRequest).subscribe({
      next: (responseMessage: string) => {
        console.log('Account withdrawal successful!', responseMessage);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Withdrawal completed successfully',
        });
        this.resetForm();
      },
      error: (error) => {
        console.error('Error completing withdrawal', error);
        if (error.status === 409) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Insufficient funds for withdrawal',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to complete withdrawal',
          });
        }
      },
    });
  }

  private accountTransfer(transaction: Partial<Transaction>) {
    const transferRequest: AccountTxn = {
      sourceAccountNumber: transaction.accountNumber as number,
      targetAccountNumber: this.transactionForm.get('toAccountNumber')?.value as number,
      amount: transaction.transactionAmount as number,
      notes: transaction.transactionNotes as string,
    };
    this.accountService.transferFunds(transferRequest).subscribe({
      next: (responseMessage: string) => {
        console.log('Account transfer successful!', responseMessage);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Transfer completed successfully',
        });
        this.resetForm();
      },
      error: (error) => {
        console.error('Error completing transfer', error);
        if (error.status === 409) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Insufficient funds for account: ${transferRequest.sourceAccountNumber}`,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to complete withdrawal',
          });
        }
      },
    });
  }

  resetForm(): void {
    this.transactionForm.reset({
      type: TransactionType.ACCOUNT_DEPOSIT,
      amount: 0.01,
      notes: '',
      accountNumber: this.accountOptions.length > 0 ? this.accountOptions[0].value : 0,
    });
  }

  isInvalidAndTouched(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  isMinLengthError(): boolean {
    return this.transactionForm.get('amount')?.hasError('min') ?? false;
  }

  isMaxLengthError(): boolean {
    return this.transactionForm.get('amount')?.hasError('max') ?? false;
  }

  isSameAccountError(): boolean {
    return this.transactionForm.get('toAccountNumber')?.hasError('sameAccount') ?? false;
  }

  private addTransferValidation(): void {
    const toAccountControl = this.transactionForm.get('toAccountNumber');
    if (toAccountControl) {
      toAccountControl.valueChanges.subscribe(() => {
        this.validateTransferAccounts();
      });
    }
  }

  private validateTransferAccounts(): void {
    const fromAccount = this.transactionForm.get('accountNumber')?.value;
    const toAccount = this.transactionForm.get('toAccountNumber')?.value;
    
    if (fromAccount && toAccount && fromAccount === toAccount) {
      this.transactionForm.get('toAccountNumber')?.setErrors({ sameAccount: true });
    } else {
      this.transactionForm.get('toAccountNumber')?.setErrors(null);
    }
  }
}

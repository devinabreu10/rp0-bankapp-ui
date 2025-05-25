import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../../models/account.model';
import { AccountType } from '../../models/account-type.enum';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '../../../../core/auth/services/auth.service';

export interface OpenAccountForm {
  accountType: FormControl<AccountType | null>;
  accountBalance: FormControl<number>;
}

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    RouterLink,
    InputNumberModule,
  ],
  templateUrl: './open-account.component.html',
  styleUrl: './open-account.component.scss',
  providers: [MessageService],
})
export class OpenAccountComponent {
  customerId: number = inject(AuthService).getUserId();
  openAccountForm!: FormGroup<OpenAccountForm>;
  accountTypes: AccountType[] = Object.values(AccountType);
  submitting: boolean = false;

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.openAccountForm = new FormGroup<OpenAccountForm>({
      accountType: new FormControl(AccountType.CHECKING, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      accountBalance: new FormControl(0.0, {
        validators: [
          Validators.required,
          Validators.min(0.01),
          Validators.max(999999999999.99),
        ],
        nonNullable: true,
      }),
    });
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.openAccountForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onSubmit(): void {
    if (this.openAccountForm.invalid) {
      return;
    }

    this.submitting = true;
    const formValue = this.openAccountForm.value;

    // Create account object
    const newAccount: Partial<Account> = {
      accountType: formValue.accountType as AccountType,
      accountBalance: formValue.accountBalance as number,
      customerId: this.customerId,
    };

    this.accountService.saveAccount(newAccount as Account).subscribe({
      next: (account: Account): void => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Account created with account #: ${account.accountNumber}`,
        });
        setTimeout(() => {
          this.router.navigate(['/accounts/dashboard']);
        }, 1500);
      },
      error: () => {
        this.submitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create account. Please try again.',
        });
      },
      complete: (): void => {
        this.submitting = false;
      },
    });
  }
}

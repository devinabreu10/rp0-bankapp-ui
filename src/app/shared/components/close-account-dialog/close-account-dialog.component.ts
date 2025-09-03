import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-close-account-dialog',
  standalone: true,
  imports: [FormsModule, InputTextModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-[#33334d]">
        <h2 class="mb-4 text-center text-2xl font-semibold">Close Account</h2>
        <p class="mb-4 text-center">
          Are you sure you want to close this account?<br />
          <span class="mt-2 block text-sm text-red-500 dark:text-red-400"
            >This action cannot be undone.</span
          >
          <span class="mt-2 block"
            >Type <span class="font-bold">{{ accountName() }}</span> below to confirm:</span
          >
        </p>
        <input
          pInputText
          [(ngModel)]="confirmationInput"
          class="mb-4 w-full rounded-lg border border-martinique-200 px-3 py-3 transition-colors focus:border-martinique-500 focus:ring-2 focus:ring-martinique-300 dark:border-martinique-800 dark:bg-martinique-950 dark:text-secondaryDark dark:focus:border-putty-300 dark:focus:ring-putty-400/30"
          placeholder="Enter account name to confirm"
        />
        <div class="flex justify-center gap-2">
          <button
            (click)="onConfirm()"
            [disabled]="confirmationInput !== accountName()"
            class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-red-300"
          >
            Confirm
          </button>
          <button
            (click)="onCancel()"
            class="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CloseAccountDialogComponent {
  accountName: InputSignal<string> = input<string>('');
  confirm: OutputEmitterRef<void> = output<void>();
  cancelChange: OutputEmitterRef<void> = output<void>();
  confirmationInput: string = '';

  onConfirm(): void {
    if (this.confirmationInput === this.accountName()) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    this.cancelChange.emit();
  }
}

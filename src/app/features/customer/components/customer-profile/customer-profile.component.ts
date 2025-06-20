import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';

export interface CustomerProfileForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  address: FormControl<string | undefined>;
  username: FormControl<string>;
}

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    NgClass,
    InputTextareaModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss',
})
export class CustomerProfileComponent implements OnInit {
  currentCustomer!: Customer;
  customerProfileForm: FormGroup<CustomerProfileForm>;

  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {
    this.customerProfileForm = new FormGroup<CustomerProfileForm>({
      firstName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      lastName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      address: new FormControl('', { nonNullable: true }),
      username: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    });
  }

  ngOnInit(): void {
    const username: string = this.authService.getUsername();
    this.customerService.getCustomerByUsername(username).subscribe({
      next: (customer: Customer): void => {
        this.currentCustomer = customer;
        this.customerProfileForm.patchValue({
          firstName: this.currentCustomer.firstName,
          lastName: this.currentCustomer.lastName,
          address: this.currentCustomer?.address,
          username: this.currentCustomer.username,
        });
      },
      error: (error): void => {
        console.error('Error loading customer profile data', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: 'Failed to load profile data',
        });
      },
    });
  }

  onSubmit(profileFormValue: Partial<Customer>): void {
    const updatedCustomer: Customer = {
      ...this.currentCustomer,
      firstName: profileFormValue.firstName!,
      lastName: profileFormValue.lastName!,
      address: profileFormValue.address,
    };

    this.customerService.updateCustomer(this.currentCustomer.id, updatedCustomer).subscribe({
      next: (response: Customer): void => {
        this.currentCustomer = response;
        console.log('Customer profile updated!', updatedCustomer);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully',
        });
      },
      error: (error): void => {
        console.error('Error updating profile', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: 'Failed to update profile',
        });
      },
    });
  }

  isInvalidAndTouched(fieldName: string): boolean | undefined {
    return (
      this.customerProfileForm.get(fieldName)?.invalid &&
      this.customerProfileForm.get(fieldName)?.touched
    );
  }
}

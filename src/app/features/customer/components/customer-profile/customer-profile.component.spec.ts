import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerProfileComponent } from './customer-profile.component';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { Customer } from '../../models/customer.model';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';

describe('CustomerProfileComponent', () => {
  let component: CustomerProfileComponent;
  let fixture: ComponentFixture<CustomerProfileComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let customerServiceMock: jasmine.SpyObj<CustomerService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;

  const mockCustomer: Customer = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    username: 'johndoe',
  };

  beforeEach(async () => {
    // Create mock services
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUsername']);
    customerServiceMock = jasmine.createSpyObj('CustomerService', [
      'getCustomerByUsername',
      'updateCustomer',
    ]);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

    // Set up default mock behavior
    authServiceMock.getUsername.and.returnValue('johndoe');
    customerServiceMock.getCustomerByUsername.and.returnValue(of(mockCustomer));
    customerServiceMock.updateCustomer.and.returnValue(of(mockCustomer));

    await TestBed.configureTestingModule({
      imports: [CustomerProfileComponent, NoopAnimationsModule, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: CustomerService, useValue: customerServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load customer data on initialization', () => {
    expect(authServiceMock.getUsername).toHaveBeenCalled();
    expect(customerServiceMock.getCustomerByUsername).toHaveBeenCalledWith('johndoe');
    expect(component.currentCustomer).toEqual(mockCustomer);

    // Check if form is populated with customer data
    expect(component.customerProfileForm.get('firstName')?.value).toBe('John');
    expect(component.customerProfileForm.get('lastName')?.value).toBe('Doe');
    expect(component.customerProfileForm.get('address')?.value).toBe('123 Main St');
    expect(component.customerProfileForm.get('username')?.value).toBe('johndoe');
  });

  it('should handle error when loading customer data fails', () => {
    spyOn(console, 'error');

    customerServiceMock.getCustomerByUsername.and.returnValue(
      throwError(() => new Error('Error loading customer profile data')),
    );

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(
      'Error loading customer profile data',
      jasmine.any(Error),
    );
  });

  it('should validate form fields correctly', () => {
    // Set form values to invalid state
    component.customerProfileForm.patchValue({
      firstName: '',
      lastName: '',
    });

    // Mark fields as touched to trigger validation
    component.customerProfileForm.get('firstName')?.markAsTouched();
    component.customerProfileForm.get('lastName')?.markAsTouched();
    fixture.detectChanges();

    // Check validation method
    expect(component.isInvalidAndTouched('firstName')).toBeTrue();
    expect(component.isInvalidAndTouched('lastName')).toBeTrue();

    // Set valid values
    component.customerProfileForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
    });
    fixture.detectChanges();

    expect(component.isInvalidAndTouched('firstName')).toBeFalse();
    expect(component.isInvalidAndTouched('lastName')).toBeFalse();
  });

  it('should show validation error messages when fields are invalid', () => {
    // Set form values to invalid state
    component.customerProfileForm.patchValue({
      firstName: '',
      lastName: '',
    });

    // Mark fields as touched to trigger validation
    component.customerProfileForm.get('firstName')?.markAsTouched();
    component.customerProfileForm.get('lastName')?.markAsTouched();
    fixture.detectChanges();

    // Check for error messages in the DOM
    const errorMessages: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.text-red-500'),
    );
    expect(errorMessages.length).toBe(2);
    expect(errorMessages[0].nativeElement.textContent).toContain('First name is required');
    expect(errorMessages[1].nativeElement.textContent).toContain('Last name is required');
  });

  it('should submit form with updated customer data', () => {
    component.customerProfileForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Oak St',
    });

    // Submit form
    component.onSubmit(component.customerProfileForm.value);

    // Verify service call
    expect(customerServiceMock.updateCustomer).toHaveBeenCalledWith(
      mockCustomer.id,
      jasmine.objectContaining({
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Oak St',
      }),
    );
  });

  it('should handle error when updating customer profile fails', () => {
    spyOn(console, 'error');

    // Setup error scenario
    customerServiceMock.updateCustomer.and.returnValue(
      throwError(() => new Error('Failed to update customer')),
    );

    // Submit form
    component.onSubmit(component.customerProfileForm.value);

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error updating profile', jasmine.any(Error));
  });

  it('should disable submit button when form is invalid', () => {
    // Set form to invalid state
    component.customerProfileForm.patchValue({
      firstName: '',
      lastName: '',
    });
    fixture.detectChanges();

    // Check if button is disabled
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button'));
    expect(submitButton.nativeElement.disabled).toBeTrue();

    // Set form to valid state
    component.customerProfileForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
    });
    fixture.detectChanges();

    // Check if button is enabled
    expect(submitButton.nativeElement.disabled).toBeFalse();
  });
});

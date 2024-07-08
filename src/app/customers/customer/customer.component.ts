import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/customer.service';
import { Customer } from '../shared/customer.model';
import { JsonPipe } from '@angular/common';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './customer.component.html',
})
export class CustomerComponent implements OnInit {
  // customer!: Customer;
  customers!: Customer[];

  customerUpdateBody: Customer = {
    id: 485,
    firstName: 'Bobby',
    lastName: 'Abreu',
    username: 'bobby123',
    address: '123456 mlb dr.',
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService
      .getCustomers()
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)))
      .subscribe({
        next: (customers) => {
          this.customers = customers;
          console.log('getCustomers: ', customers);
        },
      });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Client-side error: ${error.error.message}` // Client-side or network error
        : `Server-side error: ${error.status} - ${error.message}`; // Backend error

    console.error('An error occurred:', errorMessage);

    return throwError(() => new Error('Error has occurred; please try again later.'));
  }
}

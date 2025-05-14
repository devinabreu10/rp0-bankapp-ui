import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private cachedCustomer!: Customer;
  private readonly customerUrl: string = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customerUrl);
  }

  getCustomerByUsername(username: string): Observable<Customer> {
    if (!this.cachedCustomer) {
      return this.http
        .get<Customer>(`${this.customerUrl}/get/user/${username}`)
        .pipe(tap((data: Customer) => (this.cachedCustomer = data)));
    }

    return of(this.cachedCustomer);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.customerUrl}/get/id/${id}`);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http
      .put<Customer>(`${this.customerUrl}/update/${id}`, customer)
      .pipe(tap((data: Customer) => (this.cachedCustomer = data)));
  }

  deleteCustomerByUsername(username: string): Observable<string> {
    return this.http.delete<string>(`${this.customerUrl}/delete/user/${username}`);
  }

  deleteCustomerById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.customerUrl}/delete/id/${id}`);
  }
}

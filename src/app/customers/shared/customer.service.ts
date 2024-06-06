import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly customerUrl = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customerUrl);
  }

  getCustomerByUsername(username: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.customerUrl}/get/user/${username}`);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.customerUrl}/get/id/${id}`);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.customerUrl}/update/${id}`, customer);
  }

  deleteCustomerByUsername(username: string): Observable<string> {
    return this.http.delete<string>(`${this.customerUrl}/delete/user/${username}`);
  }

  deleteCustomerById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.customerUrl}/delete/id/${id}`);
  }
}

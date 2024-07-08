import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from './account.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly accountUrl = `${environment.apiUrl}/account`;

  constructor(private http: HttpClient) {}

  getAccountByAcctNo(acctNo: number): Observable<Account> {
    return this.http.get<Account>(`${this.accountUrl}/get/${acctNo}`);
  }

  getAccountsByUsername(username: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.accountUrl}/get/list/${username}`);
  }

  saveAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.accountUrl}/save`, account);
  }

  updateAccount(acctNo: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.accountUrl}/update/${acctNo}`, account);
  }

  deleteAccount(acctNo: number): Observable<string> {
    return this.http.delete<string>(`${this.accountUrl}/delete/${acctNo}`);
  }

  depositFunds(acctNo: number, amount: number): Observable<string> {
    return this.http.put<string>(`${this.accountUrl}/${acctNo}/deposit/${amount}`, {});
  }

  withdrawFunds(acctNo: number, amount: number): Observable<string> {
    return this.http.put<string>(`${this.accountUrl}/${acctNo}/withdraw/${amount}`, {});
  }
}

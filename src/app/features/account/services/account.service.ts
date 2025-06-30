import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { AccountTxn } from '../models/account-txn.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly accountUrl = `${environment.apiUrl}/account`;

  constructor(private readonly http: HttpClient) {}

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

  transferFunds(transferRequest: AccountTxn): Observable<string> {
    return this.http.post<string>(`${this.accountUrl}/transferFunds`, transferRequest);
  }

  depositFunds(depositRequest: AccountTxn): Observable<string> {
    return this.http.put<string>(`${this.accountUrl}/deposit`, depositRequest);
  }

  withdrawFunds(withdrawRequest: AccountTxn): Observable<string> {
    return this.http.put<string>(`${this.accountUrl}/withdraw`, withdrawRequest);
  }
}

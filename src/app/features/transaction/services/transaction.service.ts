import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Transaction, UnifiedTransactionDetails } from '../models/transaction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly transactionUrl = `${environment.apiUrl}/transaction`;

  constructor(private readonly http: HttpClient) {}

  getTransactionById(type: string, id: number): Observable<UnifiedTransactionDetails> {
    return this.http.get<UnifiedTransactionDetails>(`${this.transactionUrl}/get/${type}/${id}`);
  }

  getTransactionsByAcctNo(acctNo: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.transactionUrl}/list/account/${acctNo}`);
  }

  getTransactionsAndTransfersByCustomerId(customerId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.transactionUrl}/list/customer/${customerId}`);
  }

  saveTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.transactionUrl}/save`, transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.transactionUrl}/update/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<string> {
    return this.http.delete<string>(`${this.transactionUrl}/delete/${id}`);
  }
}

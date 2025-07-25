import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TransactionType } from '../models/transaction-type.enum';
import { Transaction } from '../models/transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TransactionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get transaction by id', () => {
    const mockTransaction: Transaction = {
      transactionId: 1,
      transactionType: TransactionType.ACCOUNT_DEPOSIT,
      transactionAmount: 100.0,
      transactionNotes: 'Test Deposit Transaction',
      createdAt: new Date(),
      accountNumber: 123456789,
    };

    service.getTransactionById(mockTransaction.transactionId).subscribe((transaction) => {
      expect(transaction).toEqual(mockTransaction);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/transaction/get/${mockTransaction.transactionId}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTransaction); // Respond with mock data
  });

  it('should get all transactions by account number', () => {
    const mockAccountNumber = 123456789;
    const mockTransactions: Transaction[] = [
      {
        transactionId: 1,
        transactionType: TransactionType.ACCOUNT_DEPOSIT,
        transactionAmount: 100.0,
        transactionNotes: 'Test Deposit Transaction',
        createdAt: new Date(),
        accountNumber: 123456789,
      },
      {
        transactionId: 2,
        transactionType: TransactionType.ACCOUNT_WITHDRAW,
        transactionAmount: 50.0,
        transactionNotes: 'Test Withdrawal Transaction',
        createdAt: new Date(),
        accountNumber: 123456789,
      },
    ];

    service.getTransactionsByAcctNo(mockAccountNumber).subscribe((transactions) => {
      expect(transactions.length).toBe(2);
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/transaction/list/account/${mockAccountNumber}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions); // Respond with mock data
  });

  it('should get all transactions and transfers by customer id', () => {
    const mockCustomerId = 1;
    const mockTransactions: Transaction[] = [
      {
        transactionId: 1,
        transactionType: TransactionType.ACCOUNT_DEPOSIT,
        transactionAmount: 100.0,
        transactionNotes: 'Test Deposit Transaction',
        createdAt: new Date(),
        accountNumber: 123456789,
      },
      {
        transactionId: 2,
        transactionType: TransactionType.ACCOUNT_WITHDRAW,
        transactionAmount: 50.0,
        transactionNotes: 'Test Withdrawal Transaction',
        createdAt: new Date(),
        accountNumber: 123456789,
      },
    ];

    service.getTransactionsAndTransfersByCustomerId(mockCustomerId).subscribe((transactions) => {
      expect(transactions.length).toBe(2);
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/transaction/list/customer/${mockCustomerId}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions); // Respond with mock data
  });

  it('should save transaction', () => {
    const mockTransaction: Transaction = {
      transactionId: 1,
      transactionType: TransactionType.ACCOUNT_DEPOSIT,
      transactionAmount: 100.0,
      transactionNotes: 'Test Deposit Transaction',
      createdAt: new Date(),
      accountNumber: 123456789,
    };

    service.saveTransaction(mockTransaction).subscribe((transaction) => {
      expect(transaction).toEqual(mockTransaction);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/transaction/save`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTransaction); // Respond with mock data
  });

  it('should update transaction using transaction id', () => {
    const mockTransaction: Transaction = {
      transactionId: 1,
      transactionType: TransactionType.ACCOUNT_DEPOSIT,
      transactionAmount: 100.0,
      transactionNotes: 'Test Deposit Transaction',
      createdAt: new Date(),
      accountNumber: 123456789,
    };

    service.updateTransaction(mockTransaction.transactionId, mockTransaction).subscribe((transaction) => {
      expect(transaction).toEqual(mockTransaction);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/transaction/update/${mockTransaction.transactionId}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockTransaction); // Respond with mock data
  });

  it('should delete transaction using transaction id', () => {
    const mockTransaction: Transaction = {
      transactionId: 1,
      transactionType: TransactionType.ACCOUNT_DEPOSIT,
      transactionAmount: 100.0,
      transactionNotes: 'Test Deposit Transaction',
      createdAt: new Date(),
      accountNumber: 123456789,
    };

    service.deleteTransaction(mockTransaction.transactionId).subscribe((response) => {
      expect(response).toBe('Transaction deleted successfully...');
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/transaction/delete/${mockTransaction.transactionId}`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush('Transaction deleted successfully...'); // Respond with mock data
  });
});

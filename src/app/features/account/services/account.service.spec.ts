import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Account } from '../models/account.model';
import { AccountType } from '../models/account-type.enum';
import { environment } from '../../../../environments/environment';

describe('AccountService', () => {
  let service: AccountService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AccountService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch account by account number', () => {
    const mockAccount: Account = {
      accountNumber: 12345789,
      accountType: AccountType.CHECKING,
      accountBalance: 100.0,
      customerId: 1,
    };

    service.getAccountByAcctNo(mockAccount.accountNumber).subscribe((response) => {
      expect(response).toEqual(mockAccount);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/account/get/${mockAccount.accountNumber}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockAccount);
  });

  it('should fetch all accounts tied to username', () => {
    const username = 'testUser';
    const mockAccounts: Account[] = [
      {
        accountNumber: 123457890,
        accountType: AccountType.CHECKING,
        accountBalance: 100.0,
        customerId: 1,
      },
      {
        accountNumber: 7583905834,
        accountType: AccountType.SAVINGS,
        accountBalance: 1.0,
        customerId: 1,
      },
    ];

    service.getAccountsByUsername(username).subscribe((response) => {
      expect(response.length).toBe(2);
      expect(response).toEqual(mockAccounts);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/account/get/list/${username}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);
  });

  it('should save new account', () => {
    const mockAccount: Account = {
      accountNumber: 12345789,
      accountType: AccountType.CHECKING,
      accountBalance: 100.0,
      customerId: 1,
    };

    service.saveAccount(mockAccount).subscribe((response) => {
      expect(response).toEqual(mockAccount);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/account/save`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAccount);
  });

  it('should update existing account', () => {
    const mockAccount: Account = {
      accountNumber: 12345789,
      accountType: AccountType.CHECKING,
      accountBalance: 100.0,
      customerId: 1,
    };

    service.updateAccount(mockAccount.accountNumber, mockAccount).subscribe((response) => {
      expect(response).toEqual(mockAccount);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/account/update/${mockAccount.accountNumber}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockAccount);
  });

  it('should delete account by account number', () => {
    const id = 1;

    service.deleteAccount(id).subscribe((response) => {
      expect(response).toBe('Account successfully deleted!');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/account/delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Account successfully deleted!');
  });

  it('should transfer funds between accounts', () => {
    const payload = {
      sourceAccountNumber: 1,
      destinationAccountNumber: 2,
      amount: 10.0,
    };

    service.transferFunds(payload).subscribe((response) => {
      expect(response).toBe('Successfully transferred funds between accounts...');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/account/transferFunds`);
    expect(req.request.method).toBe('POST');
    req.flush('Successfully transferred funds between accounts...');
  });

  it('should deposit funds into account', () => {
    const payload = {
      sourceAccountNumber: 1,
      amount: 10.0,
    };

    service.depositFunds(payload).subscribe((response) => {
      expect(response).toBe('Successfully deposited funds into account...');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/account/deposit`);
    expect(req.request.method).toBe('PUT');
    req.flush('Successfully deposited funds into account...');
  });

  it('should withdraw funds from account', () => {
    const payload = {
      sourceAccountNumber: 1,
      amount: 10.0,
    };

    service.withdrawFunds(payload).subscribe((response) => {
      expect(response).toBe('Successfully withdrew funds from account...');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/account/withdraw`);
    expect(req.request.method).toBe('PUT');
    req.flush('Successfully withdrew funds from account...');
  });
});

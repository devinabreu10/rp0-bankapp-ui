import { TestBed } from '@angular/core/testing';

import { CustomerService } from './customer.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Customer } from '../models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CustomerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all customers', () => {
    const mockCustomers: Customer[] = [
      {
        id: 1,
        username: 'johndoe1',
        firstName: 'John',
        lastName: 'Doe',
        address: '12345 Rand Dr.',
      },
      {
        id: 2,
        username: 'janedoe2',
        firstName: 'Jane',
        lastName: 'Doe',
        address: '12345 Rand Dr.',
      },
    ];

    service.getCustomers().subscribe((customers) => {
      expect(customers.length).toBe(2);
      expect(customers).toEqual(mockCustomers);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/customer`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockCustomers); // Respond with mock data
  });

  it('should fetch customer from server when cache is empty', () => {
    const mockCustomer: Customer = {
      id: 1,
      username: 'johndoe1',
      firstName: 'John',
      lastName: 'Doe',
      address: '12345 Rand Dr.',
    };

    service.getCustomerByUsername(mockCustomer.username).subscribe((customer) => {
      expect(customer).toEqual(mockCustomer);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/customer/get/user/${mockCustomer.username}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomer);
  });

  it('should return customer from cache if available', () => {
    const mockCustomer: Customer = {
      id: 1,
      username: 'johndoe1',
      firstName: 'John',
      lastName: 'Doe',
      address: '12345 Rand Dr.',
    };

    service['cachedCustomer'] = mockCustomer;

    service.getCustomerByUsername(mockCustomer.username).subscribe((customer) => {
      expect(customer).toBe(mockCustomer);
    });

    httpTestingController.verify();
  });

  it('should get customer by id', () => {
    const mockCustomer: Customer = {
      id: 1,
      username: 'johndoe1',
      firstName: 'John',
      lastName: 'Doe',
      address: '12345 Rand Dr.',
    };

    service.getCustomerById(mockCustomer.id).subscribe((customer) => {
      expect(customer).toEqual(mockCustomer);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/customer/get/id/${mockCustomer.id}`,
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockCustomer);
  });

  it('should update customer by id', () => {
    const mockCustomer: Customer = {
      id: 1,
      firstName: 'test',
      lastName: 'test',
      address: 'test',
      username: 'test',
    };

    service.updateCustomer(mockCustomer.id, mockCustomer).subscribe((customer) => {
      expect(customer).toEqual(mockCustomer);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/customer/update/${mockCustomer.id}`,
    );

    expect(req.request.method).toEqual('PUT');
    req.flush(mockCustomer);
  });

  it('should delete customer by username', () => {
    const username = 'testUser';

    service.deleteCustomerByUsername(username).subscribe((response) => {
      expect(response).toBe('Customer deleted successfully');
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/customer/delete/user/${username}`,
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush('Customer deleted successfully');
  });

  it('should delete customer by id', () => {
    const id = 1;

    service.deleteCustomerById(id).subscribe((response) => {
      expect(response).toBe('Customer deleted successfully');
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/customer/delete/id/${id}`,
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush('Customer deleted successfully');
  });
});

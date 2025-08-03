import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionDetailsComponent } from './transaction-details.component';
import { TransactionService } from '../../services/transaction.service';
import { of, throwError } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionType } from '../../models/transaction-type.enum';
import { provideHttpClient } from '@angular/common/http';

describe('TransactionDetailsComponent', () => {
  let component: TransactionDetailsComponent;
  let fixture: ComponentFixture<TransactionDetailsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let transactionService: TransactionService;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => '1',
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [TransactionDetailsComponent, CurrencyPipe, DatePipe],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        TransactionService,
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailsComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch transaction on init if id is present', () => {
    const txn: Transaction = { transactionId: 1, transactionAmount: 100, transactionType: TransactionType.ACCOUNT_DEPOSIT, transactionNotes: 'Test Deposit Transaction', createdAt: new Date(), accountNumber: 123456789 };
    spyOn(transactionService, 'getTransactionById').and.returnValue(of(txn));
    component.ngOnInit();
    expect(transactionService.getTransactionById).toHaveBeenCalledWith(1);
    expect(component.loading).toBeFalse();
    expect(component.transaction).toBe(txn);
    expect(component.errorMsg).toBe('');
  });

  it('should handle error if transaction not found', () => {
    spyOn(transactionService, 'getTransactionById').and.returnValue(throwError(() => new Error('Not found')));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('Transaction not found.');
  });

  it('should handle invalid transaction id', () => {
    mockActivatedRoute.snapshot.paramMap.get = () => null;
    component.ngOnInit();
    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('Invalid transaction.');
  });

  it('should navigate back to history', () => {
    component.backToHistory();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['transactions']);
  });
});

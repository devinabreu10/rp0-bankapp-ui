import { TransactionType } from './transaction-type.enum';

export interface Transaction {
  transactionId: number;
  transactionType: TransactionType;
  transactionAmount: number;
  transactionNotes: string;
  createdAt: Date;
  accountNumber: number;
}

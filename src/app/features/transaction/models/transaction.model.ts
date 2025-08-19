import { TransactionType } from './transaction-type.enum';

export interface Transaction {
  transactionId: number;
  transactionType: TransactionType;
  transactionAmount: number;
  transactionNotes: string;
  createdAt: Date;
  accountNumber: number;
}

export interface UnifiedTransactionDetails {
  id: number;
  type: TransactionType;
  amount: number;
  notes: string;
  createdAt: Date;
  accountNumber: number;
  itemType: string;
  additionalDetails: { [key: string]: any };
}

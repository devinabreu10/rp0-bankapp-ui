import { TransactionType } from './transaction-type.enum';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  notes: string;
  date: Date;
  accountNumber: number;
}

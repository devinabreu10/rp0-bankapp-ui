export interface AccountTxn {
  sourceAccountNumber: number;
  targetAccountNumber?: number;
  amount: number;
  notes?: string;
}

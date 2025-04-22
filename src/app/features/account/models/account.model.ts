import { AccountType } from "./account-type.enum";

export interface Account {
    accountNumber: number;
    accountType: AccountType;
    accountBalance: number;
    customerId: number;
}

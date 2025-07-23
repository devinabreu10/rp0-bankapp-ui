import { AccountType } from "./account-type.enum";

export interface Account {
    accountNumber: number;
    nickname?: string;
    accountType: AccountType;
    accountBalance: number;
    customerId: number;
}

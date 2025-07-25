import { Routes } from '@angular/router';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TransactionHistoryComponent,
      },
      {
        path: 'add',
        component: TransactionComponent,
      },
      {
        path: ':id',
        component: TransactionDetailsComponent,
      },
    ],
  },
];

export default routes;

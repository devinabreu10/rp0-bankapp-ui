import { Routes } from '@angular/router';
import { AccountDashboardComponent } from './components/account-dashboard/account-dashboard.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AddAccountComponent } from './components/add-account/add-account.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: AccountDashboardComponent,
      },
      {
        path: 'open-account',
        component: AddAccountComponent,
      },
      {
        path: ':accountNumber',
        component: AccountDetailsComponent,
      },
    ],
  },
];

export default routes;

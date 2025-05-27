import { Routes } from '@angular/router';
import { AccountDashboardComponent } from './components/account-dashboard/account-dashboard.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { OpenAccountComponent } from './components/open-account/open-account.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AccountDashboardComponent,
      },
      {
        path: 'open-account',
        component: OpenAccountComponent,
      },
      {
        path: ':accountNumber',
        component: AccountDetailsComponent,
      },
    ],
  },
];

export default routes;

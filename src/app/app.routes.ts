import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { HomeComponent } from './shared/components/home/home.component';
import { CustomerComponent } from './customers/customer/customer.component';
import { authGuard } from './core/auth/auth.guard';
import { SignUpComponent } from './core/auth/pages/sign-up/sign-up.component';
import { AccountComponent } from './accounts/account/account.component';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { AuthService } from './core/auth/services/auth.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'accounts',
    component: AccountComponent,
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'transactions',
    component: TransactionComponent,
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';
import { HomeComponent } from './shared/pages/home/home.component';
import { authGuard } from './core/auth/auth.guard';
import { AuthService } from './core/auth/services/auth.service';
import { inject } from '@angular/core';

/**
 * Routing Strategy: Lazy Loading
 * ------------------------------
 * This app uses lazy loading to optimize performance and scalability.
 *
 * - Loads routes/modules only when needed, reducing initial bundle size.
 * - Improves load time and user experience, especially on slower networks.
 * - Supports standalone components via `loadComponent` (Angular 14+).
 * - Keeps feature logic modular and maintainable.
 *
 * Note: Use lazy loading for non-critical pages that aren't needed on initial load.
 */
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./shared/pages/about-us/about-us.component').then(
        (m) => m.AboutUsComponent
      ),
  },
  // {
  //   path: 'contact-us',
  //   loadComponent: () =>
  //     import('./shared/pages/contact-us/contact-us.component').then(
  //       (m) => m.ContactUsComponent
  //     ),
  // },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./core/auth/pages/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'customer',
    loadComponent: () =>
      import('./features/customer/pages/customer/customer.component').then(
        (m) => m.CustomerComponent,
      ),
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./features/account/pages/account/account.component').then(
        (m) => m.AccountComponent,
      ),
    canActivate: [() => inject(AuthService).isAuthenticated],
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transaction/pages/transaction/transaction.component').then(
        (m) => m.TransactionComponent,
      ),
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

import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  // {
  //   path: '/home',
  //   component: HomeComponent,
  // },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

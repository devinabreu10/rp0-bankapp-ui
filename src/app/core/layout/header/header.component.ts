import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../../shared/components/theme-toggle-button/theme-toggle-button.component';
import { AuthService } from '../../auth/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ThemeToggleButtonComponent,
    AsyncPipe,
    TieredMenuModule,
    RippleModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isAuthenticated$ = this.authService.isAuthenticated;
  currentUser$ = this.authService.currentUser;
  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('isAuthenticated: ' + isAuthenticated);
    });

    this.currentUser$.subscribe((currentUser) => {
      console.log('currentUser: ', currentUser);
    });

    this.primengConfig.ripple = true;

    // this.items for TieredMenu
    this.items = [
      {
        label: 'Accounts',
        icon: 'pi menu pi-building-columns',
        items: [
          {
            label: 'Manage Accounts',
            icon: 'pi menu pi-list',
          },
          {
            label: 'Open Account',
            icon: 'pi menu pi-plus',
          },
          {
            label: 'Remove Account',
            icon: 'pi menu pi-times',
          },
        ],
      },
      {
        label: 'Transactions',
        icon: 'pi menu pi-book',
      },
      {
        label: 'My Profile',
        icon: 'pi menu pi-user',
      },
      {
        label: 'Logout',
        icon: 'pi menu pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  logout() {
    this.authService.logout();
  }
}

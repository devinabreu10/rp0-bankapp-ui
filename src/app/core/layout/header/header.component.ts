import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../../shared/components/theme-toggle-button/theme-toggle-button.component';
import { MobileMenuComponent } from '../../../shared/components/mobile-menu/mobile-menu.component';
import { AuthService } from '../../auth/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { UserAuth } from '../../auth/user-auth.model';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ThemeToggleButtonComponent,
    MobileMenuComponent,
    AsyncPipe,
    MenuModule,
    RippleModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isAuthenticated$ = this.authService.isAuthenticated;
  currentUser$ = this.authService.currentUser;
  items: MenuItem[] | undefined;
  showMobileMenu: boolean = false;

  constructor(
    private authService: AuthService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('isAuthenticated: ' + isAuthenticated);
    });

    this.currentUser$.subscribe((currentUser) => {
      console.log('currentUser: ', currentUser);
    });

    this.primengConfig.ripple = true;

    // this.items for Menu
    this.items = [
      {
        label: 'Accounts',
        icon: 'pi menu pi-building-columns',
        command: (): Promise<boolean> => this.router.navigate(['accounts']),
      },
      {
        label: 'Transactions',
        icon: 'pi menu pi-book',
        command: (): Promise<boolean> => this.router.navigate(['transactions']),
      },
      {
        label: 'My Profile',
        icon: 'pi menu pi-user',
        command: (): Promise<boolean> => this.router.navigate([`profile`]),
      },
      {
        label: 'Logout',
        icon: 'pi menu pi-sign-out',
        command: (): void => this.logout(),
      },
    ];
  }

  setUserFullName(user: UserAuth): string {
    const { firstName, lastName } = user;
    const fullName = `${firstName} ${lastName}`;
    return fullName.length > 11 ? `${firstName} ${lastName.substring(0, 1)}.` : fullName;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }
}

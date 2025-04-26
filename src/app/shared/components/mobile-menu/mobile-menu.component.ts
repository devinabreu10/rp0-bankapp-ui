import { Component, input, output, OutputEmitterRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { UserAuth } from '../../../core/auth/user-auth.model';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RippleModule],
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {
  // Inputs
  isAuthenticated = input<boolean>(false);
  showMenu = input<boolean>(false);
  menuItems = input<MenuItem[] | undefined>(undefined);
  currentUser = input<UserAuth | null>(null);

  // Output events
  menuClose: OutputEmitterRef<void> = output<void>();
  logout: OutputEmitterRef<void> = output<void>();

  // Method to close menu when a menu item is clicked
  closeMenu(): void {
    this.menuClose.emit();
  }

  // Method to emit logout event
  onLogoutClick(): void {
    this.logout.emit();
    this.closeMenu();
  }
}

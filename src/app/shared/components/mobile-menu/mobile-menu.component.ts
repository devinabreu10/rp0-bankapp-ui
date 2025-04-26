import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RippleModule],
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {
  // Inputs
  isAuthenticated: InputSignal<boolean> = input<boolean>(false);
  showMenu: InputSignal<boolean> = input<boolean>(false);

  // Output events
  menuToggle: OutputEmitterRef<void> = output<void>();
  logout: OutputEmitterRef<void> = output<void>();

  // Method to toggle menu when menu icon is clicked
  toggleMenu(): void {
    this.menuToggle.emit();
  }

  // Method to emit logout event
  onLogoutClick(): void {
    this.logout.emit();
    this.toggleMenu();
  }
}

import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  navigateGetStarted(): void {
    this.authService.isAuthenticated.subscribe((isAuthenticated: boolean): void => {
      if (isAuthenticated) {
        this.router.navigate(['accounts']);
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  navigateLearnMore(): void {
    this.router.navigate(['about-us']);
  }

  navigateOpenAccount(): void {
    this.authService.isAuthenticated.subscribe((isAuthenticated: boolean): void => {
      if (isAuthenticated) {
        this.router.navigate(['accounts']); // Replace it with the actual route to open an account
      } else {
        this.router.navigate(['sign-up']);
      }
    });
  };
}

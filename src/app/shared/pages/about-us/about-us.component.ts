import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  navigateContactUs(): void {
    this.router.navigate(['contact-us']);
  }

  navigateOpenAccount(): void {
    this.authService.isAuthenticated.subscribe((isAuthenticated: boolean): void => {
      if (isAuthenticated) {
        this.router.navigate(['accounts']);
      } else {
        this.router.navigate(['login']);
      }
    });
  }
}

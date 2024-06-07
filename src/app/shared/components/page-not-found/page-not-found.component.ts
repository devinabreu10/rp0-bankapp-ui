import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RippleModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router,
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  navigateToHome() {
    this.router.navigate(['login']);
  }
}

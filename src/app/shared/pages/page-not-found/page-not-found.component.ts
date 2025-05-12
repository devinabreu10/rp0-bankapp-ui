import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RippleModule],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {
  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  navigateToHome(): void {
    this.router.navigate(['']);
  }

  goBack(): void {
    this.location.back();
  }
}

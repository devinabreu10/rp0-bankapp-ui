import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RippleModule],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent implements OnInit {
  constructor(
    private readonly primengConfig: PrimeNGConfig,
    private readonly router: Router,
    private readonly location: Location,
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

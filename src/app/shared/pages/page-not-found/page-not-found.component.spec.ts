import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundComponent } from './page-not-found.component';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let primengConfig: jasmine.SpyObj<PrimeNGConfig>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const primengConfigSpy = jasmine.createSpyObj('PrimeNGConfig', ['ripple']);

    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent, RippleModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: PrimeNGConfig, useValue: primengConfigSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    primengConfig = TestBed.inject(PrimeNGConfig) as jasmine.SpyObj<PrimeNGConfig>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable primeng ripple effect on component initialization', () => {
    primengConfig.ripple = false;
    component.ngOnInit();
    expect(primengConfig.ripple).toBe(true);
  });

  it('should navigate user back to the home page', () => {
    component.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should go back to previous page', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});

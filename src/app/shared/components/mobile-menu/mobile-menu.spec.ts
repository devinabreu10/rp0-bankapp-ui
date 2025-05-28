import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileMenuComponent } from './mobile-menu.component';
import { RippleModule } from 'primeng/ripple';
import { RouterLink, RouterLinkActive } from '@angular/router';

describe('MobileMenuComponent', () => {
  let component: MobileMenuComponent;
  let fixture: ComponentFixture<MobileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenuComponent, RouterLink, RouterLinkActive, RippleModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit menuToggle event when toggleMenu is called', () => {
    const menuToggleSpy = spyOn(component.menuToggle, 'emit');
    component.toggleMenu();
    expect(menuToggleSpy).toHaveBeenCalled();
  });

  it('should emit logout event and call toggleMenu when onLogoutClick is called', () => {
    const logoutSpy = spyOn(component.logout, 'emit');
    const toggleMenuSpy = spyOn(component, 'toggleMenu');
    component.onLogoutClick();
    expect(logoutSpy).toHaveBeenCalled();
    expect(toggleMenuSpy).toHaveBeenCalled();
  });
});

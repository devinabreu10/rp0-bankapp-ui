import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactUsComponent } from './contact-us.component';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsComponent, NgOptimizedImage, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitForm', () => {
    it('should prevent default form submission behavior', () => {
      const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
      spyOn(window, 'alert');
      component.submitForm(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should log "Form submitted" to the console', () => {
      const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
      const consoleSpy = spyOn(console, 'log');
      spyOn(window, 'alert');
      component.submitForm(mockEvent);
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted');
    });

    it('should display an alert with a thank you message', () => {
      const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
      const alertSpy = spyOn(window, 'alert');
      component.submitForm(mockEvent);
      expect(alertSpy).toHaveBeenCalledWith(
        'Thank you for your message! We will get back to you soon.',
      );
    });
  });
});

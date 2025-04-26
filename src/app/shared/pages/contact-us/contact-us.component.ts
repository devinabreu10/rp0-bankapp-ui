import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html'
})
export class ContactUsComponent {
  // Form submission handling
  submitForm(event: Event): void {
    event.preventDefault();
    console.log('Form submitted');
    alert('Thank you for your message! We will get back to you soon.');
  }
}

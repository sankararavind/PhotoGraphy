import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private api = inject(ApiService);

  contactData = {
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: ''
  };
  
  isSubmitting = false;
  successMessage = '';
  
  onSubmit() {
    if (!this.contactData.name || !this.contactData.email || !this.contactData.message || !this.contactData.eventType) return;
    
    this.isSubmitting = true;
    
    this.api.post('contacts', this.contactData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Your inquiry has been sent successfully. We will get back to you within 24 hours.';
        this.contactData = { name: '', email: '', phone: '', message: '', eventType: '', eventDate: '' };
        
        setTimeout(() => {
          this.successMessage = '';
        }, 6000);
      },
      error: () => {
        this.isSubmitting = false;
        alert('There was an error sending your message. Please try again.');
      }
    });
  }
}

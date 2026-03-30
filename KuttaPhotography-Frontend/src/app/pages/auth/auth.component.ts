import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isSignUp = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleAuth() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.auth.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Invalid email or password';
          this.loading = false;
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.auth.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = 'Registration successful! You can now sign in.';
          setTimeout(() => {
            this.isSignUp = false;
            this.successMessage = '';
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.error || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}

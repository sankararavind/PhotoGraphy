import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = window.location.origin.includes('localhost:4200') 
    ? 'http://localhost:5274/api/auth' 
    : '/api/auth';

  private isAuth = new BehaviorSubject<boolean>(this.checkAuth());
  isAuth$ = this.isAuth.asObservable();
  
  private userRole = new BehaviorSubject<string | null>(localStorage.getItem('user_role'));

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('user_role', res.role);
          this.isAuth.next(true);
          this.userRole.next(res.role);
        }
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    this.isAuth.next(false);
    this.userRole.next(null);
    this.router.navigate(['/auth']);
  }

  private checkAuth(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  get isLoggedIn(): boolean {
    return this.isAuth.value;
  }

  get isAdmin(): boolean {
    return this.userRole.value === 'Admin';
  }
}

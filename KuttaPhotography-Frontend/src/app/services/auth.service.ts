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

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
          this.isAuth.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isAuth.next(false);
    this.router.navigate(['/admin/login']);
  }

  private checkAuth(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  get isLoggedIn(): boolean {
    return this.isAuth.value;
  }
}

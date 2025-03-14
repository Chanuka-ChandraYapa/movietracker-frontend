import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private storageService: StorageService) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
      const token = this.storageService.getItem('token');
      const user = this.storageService.getItem('user');
      
      if (token && user) {
        this.tokenSubject.next(token);
        this.currentUserSubject.next(JSON.parse(user));
      }
  }

  login(usernameOrEmail: string, password: string): Observable<string> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { usernameOrEmail, password }).pipe(
      // After successful login, call the "/me" endpoint to fetch user details
      switchMap(loginResponse => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${loginResponse.accessToken}`
        });
        return this.http.get<User>(`${this.apiUrl}/me`, {headers}).pipe(
          map(userResponse => {
            // Call setSession with both LoginResponse and UserResponse
            this.setSession(loginResponse, userResponse);
            console.log('Logged in:', loginResponse, userResponse);
            return loginResponse.accessToken;
          })
        );
      }),
      // Handle errors
      catchError(error => {
        console.error('Login failed:', error);
        throw error; // Re-throw the error to propagate it
      })
    );
  }

  register(username: string, displayName: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { username, displayName, email, password }).pipe(
      tap(response => {
        // this.setSession(response);
        console.log('Registered:', response);
      }),
      map(response => response),
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  private setSession(authResult: LoginResponse, userResult: User): void {
    this.storageService.setItem('token', authResult.accessToken);
    this.storageService.setItem('user', JSON.stringify(userResult));
    this.tokenSubject.next(authResult.accessToken);
    this.currentUserSubject.next(userResult);
  }

  logout(): void {
    this.storageService.removeItem('token');
    this.storageService.removeItem('user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }
}

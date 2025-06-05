import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/login-models/User';
import {Router} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiURL = 'http://localhost:3000/user';

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURL, user);
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(this.apiURL + "/login", { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Liest die aktuelle User-ID aus den im LocalStorage gespeicherten User-Daten
  getCurrentUserId(): number | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user: any = JSON.parse(userJson);
        return user.user_id || null;
      } catch (error) {
        console.error('Fehler beim Parsen der User-Daten:', error);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logoutUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  changePassword(newPassword: string, currentPassword: string): Observable<any> {
    return this.http.patch(this.apiURL + "/update-password", { newPassword, currentPassword });
  }

  changeEmail(password: string, email: string): Observable<any> {
    return this.http.patch(this.apiURL + "/update-email", { password, email });
  }
}

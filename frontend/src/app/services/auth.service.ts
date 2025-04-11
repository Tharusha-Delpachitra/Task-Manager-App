import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; 

  constructor(private http: HttpClient) { }

  /**
   * Registers a new user with the provided credentials.
   * @param registrationData - Object containing username and password.
   * @returns Observable of the backend response (text).
   */
  register(registrationData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registrationData, { responseType: 'text' });
  }

  /**
   * Logs in an existing user with the provided credentials.
   * @param loginData - Object containing username and password.
   * @returns Observable of the backend response (likely containing JWT).
   */
  login(loginData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }
}
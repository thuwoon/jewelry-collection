import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Headers } from '../httpCommon.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  accLogin(user: any): Observable<any> {
    const headers = Headers;
    const body = {
      email: user.email,
      password: user.password
    };
    return this.http.post<any>('http://localhost:4200/api/login', body, { headers });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const hasToken = token ? true : false;
    return hasToken
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Headers } from '../httpCommon.service';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }
  getPostList(): Observable<any> {
    const headers = Headers;
    return this.http.get<any>('http://localhost:4200/api/post/list', { headers });
  }
}
// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private baseUrl = 'http://195.148.31.118/api';
  private headers = new HttpHeaders({
    Accept: 'application/vnd.mason+json',
  });

  constructor(private http: HttpClient) {}

  createUser(userData: any): Observable<any> {
    return this.http.post('http://localhost/api/users/', userData,   {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.mason+json',
        'Content-Type': 'application/json'
      }),
      observe: 'response',  
      responseType: 'json'
    });
  }
}

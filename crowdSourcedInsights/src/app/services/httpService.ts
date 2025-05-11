// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private baseUrl = 'http://localhost/api';
   private headers=  new HttpHeaders({
        'Accept': 'application/vnd.mason+json',
        'Content-Type': 'application/json'
      });

  constructor(private http: HttpClient) {}

  createUser(userData: any): Observable<any> {
    return this.http.post(this.baseUrl+'/users/', userData,   {
      headers: this.headers,
      observe: 'response',  
      responseType: 'json'
    });
  }

    createInsight(insightData: any): Observable<any> {
      const header = new HttpHeaders({
        'Accept': 'application/vnd.mason+json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('api_key')
      });
    return this.http.post(this.baseUrl+ "/users/"+insightData.user + '/insights/', insightData,   {
      headers: header,
      observe: 'response',  
      responseType: 'json'
    });
  }


  getInsights(params: { bbox?: string; usr?: string; ic?: string; isc?: string }): Observable<any> {
  
  let httpParams = new HttpParams();

  if (params.bbox) httpParams = httpParams.set('bbox', params.bbox);
  if (params.usr) httpParams = httpParams.set('usr', params.usr);
  if (params.ic) httpParams = httpParams.set('ic', params.ic);
  if (params.isc) httpParams = httpParams.set('isc', params.isc);

  return this.http.get(this.baseUrl + '/insights/', {
    headers: this.headers,
    params: httpParams,
    observe: 'response',
    responseType: 'json'
  });
  }

  getInsightDetail(insightId: string): Observable<any> {
    return this.http.get(this.baseUrl + '/insights/' + insightId, {
      headers: this.headers,
      observe: 'response',
      responseType: 'json'
    });
  }
}

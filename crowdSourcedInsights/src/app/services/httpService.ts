// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFeedback, IGeneral, IInsight, IUser } from '../models/models';

/**
 * HttpService
 * -----------
 * This Angular service provides HTTP methods for interacting with the backend API.
 * 
 * Main Functions:
 * - User management: create users.
 * - Insight management: create, update, fetch, and delete insights.
 * - Feedback management: add, update, fetch, and delete feedback for insights.
 * - Handles HTTP headers, authentication tokens, and response types.
 * 
 */

@Injectable({ providedIn: 'root' })
export class HttpService {
  private baseUrl = 'http://195.148.31.118/api';
   private headers=  new HttpHeaders({
        'Accept': 'application/vnd.mason+json',
        'Content-Type': 'application/json'
      });

  constructor(private http: HttpClient) {}

  createUser(userData: IUser): Observable<HttpResponse<IGeneral>> {
    return this.http.post(this.baseUrl+'/users/', userData,   {
      headers: this.headers,
      observe: 'response',  
      responseType: 'json'
    });
  }
    createInsight(insightData: IInsight): Observable<HttpResponse<IGeneral>> {
      const header = new HttpHeaders({
        'Accept': 'application/vnd.mason+json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('api_key')
      });
    return this.http.post(this.baseUrl+ "/users/"+insightData["user"] + '/insights/', insightData,   {
      headers: header,
      observe: 'response',  
      responseType: 'json'
    });
  }

  updateInsight(insightData: IInsight): Observable<HttpResponse<IGeneral>> {
    const header = new HttpHeaders({
      'Accept': 'application/vnd.mason+json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('api_key')
    });
    return this.http.put(this.baseUrl + '/users/' + insightData.user + '/insights/' + insightData.id, insightData, {
      headers: header,
      observe: 'response',
      responseType: 'json'
    });
  }
  


  getInsights(params: { bbox?: string; usr?: string; ic?: string; isc?: string }): Observable<HttpResponse<IGeneral>> {
  
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

  getInsightDetail(insightId: string): Observable<HttpResponse<IGeneral>> {
    return this.http.get(this.baseUrl + '/insights/' + insightId, {
      headers: this.headers,
      observe: 'response',
      responseType: 'json'
    });
  }

  deleteInsight(userId: string, insightId: string): Observable<HttpResponse<IGeneral>> {
       const header = new HttpHeaders({
        'Accept': 'application/vnd.mason+json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('api_key')
      });
    return this.http.delete(this.baseUrl + '/users/' + userId + '/insights/' + insightId, {
      headers: header,
      observe: 'response',
      responseType: 'json'
    });
  }

  addFeedback(insightId: string, userId: string,  feedbackData: IFeedback): Observable<HttpResponse<IGeneral>> {

    const header = new HttpHeaders({
      'Accept': 'application/vnd.mason+json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('api_key')
    });
    return this.http.post(this.baseUrl + '/users/' + userId + '/insights/' + insightId + '/feedbacks/', feedbackData, {
      headers: header,
      observe: 'response',
      responseType: 'json'
    });
  }


  fetchFeedbacks(creatorId: string, insightId: string): Observable<HttpResponse<IGeneral>> {
    const header = new HttpHeaders({
      'Accept': 'application/vnd.mason+json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('api_key')
    });
    return this.http.get(this.baseUrl +'/users/' + creatorId + '/insights/' + insightId + '/feedbacks/', {
      headers: header,
      observe: 'response',
      responseType: 'json'
    });
  }

  deleteFeedback(creatorId: string, insightId: string, feedbackId: string): Observable<HttpResponse<IGeneral>> {
    const header = new HttpHeaders({
      'Accept': 'application/vnd.mason+json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('api_key')
    });
    return this.http.delete(this.baseUrl + '/users/' + creatorId + '/insights/' + insightId + '/feedbacks/' + feedbackId, {
      headers: header,
      observe: 'response',
      responseType: 'json'
    });
  }

  updateFeedback(creatorId: string, insightId: string, feedbackId: string, feedbackData: IFeedback): Observable<HttpResponse<IGeneral>> {
    const header = new HttpHeaders({
      'Accept': 'application/vnd.mason+json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('api_key')
    });
    return this.http.put(this.baseUrl + '/users/' + creatorId + '/insights/' + insightId + '/feedbacks/' + feedbackId, feedbackData, {
      headers: header,
      observe: 'response',
      responseType: 'json'
    });
  }
}

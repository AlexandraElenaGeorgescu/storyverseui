import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl = 'http://localhost:50295/api/notifications';

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any> {
    const token = localStorage.getItem('user-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/notifications`, { headers });
  }

  markNotificationAsRead(id: string): Observable<any> {
    const token = localStorage.getItem('user-token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.baseUrl}/notifications/mark-read/${id}`, {}, { headers, responseType: 'text' });
  }
}

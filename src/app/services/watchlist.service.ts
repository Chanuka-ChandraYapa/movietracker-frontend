import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = `${environment.apiUrl}/api/watchlist`;

  constructor(private http: HttpClient) { }

  addToWatchlist(userId: number, mediaId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/${mediaId}`, {});
  }

  addToWatchlistWithDetails(userId: number, mediaId: number, details: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/${mediaId}`, details);
  }

  removeFromWatchlist(userId: number, mediaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/${mediaId}`);
  }
}

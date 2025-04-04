import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomList } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private apiUrl = `${environment.apiUrl}/api/lists`;

  constructor(private http: HttpClient) { }

  getList(id: number): Observable<CustomList> {
    return this.http.get<CustomList>(`${this.apiUrl}/${id}`);
  }

  getAllPublicLists(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  createList(userId: number, list: Partial<CustomList>): Observable<CustomList> {
    return this.http.post<CustomList>(`${this.apiUrl}/${userId}`, list);
  }

  updateList(id: number, list: Partial<CustomList>): Observable<CustomList> {
    return this.http.put<CustomList>(`${this.apiUrl}/${id}`, list);
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMediaToList(listId: number, mediaId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${listId}/add/${mediaId}`, {});
  }

  removeMediaFromList(listId: number, mediaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${listId}/remove/${mediaId}`);
  }
}

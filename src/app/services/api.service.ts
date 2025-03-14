import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User, CustomList } from '../models/user.model';
import { Media, Review } from '../models/media.model';
import { WatchedItem } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  // Example method to get a user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  // Example method to get a movie by ID
  getMovieById(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.baseUrl}/media/${id}`);
  }

  getMediaByGenre(genre: string): Observable<Media[]> {
    const body = { };
    return this.http.get<{ content: Media[] }>(`${this.baseUrl}/media/genre/${genre}`, body).pipe(
      map(response => response.content)
    );
  }

  // Example method to get reviews for a movie
  getMovieReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/media/${id}/reviews`);
  }

  // Example method to get a user's watchlist
  getWatchlist(userId: number): Observable<WatchedItem[]> {
    return this.http.get<WatchedItem[]>(`${this.baseUrl}/users/${userId}/watchlist`);
  }

  // Example method to get a user's custom lists
  getCustomLists(userId: number): Observable<CustomList[]> {
    return this.http.get<CustomList[]>(`${this.baseUrl}/users/${userId}/lists`);
  }
}

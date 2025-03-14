import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { User, UserStats, CustomList  } from '../models/user.model';
import { Review, Media } from '../models/media.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) { }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  followUser(followerId: number, followingId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${followerId}/follow/${followingId}`, {});
  }

  unfollowUser(followerId: number, followingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${followerId}/unfollow/${followingId}`);
  }

  getUserWatchlist(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/watchlist`);
  }

  getUserStats(id: number): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/${id}/stats`);
  }

  getUserReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${id}/reviews`);
  }

  getUserRecommendations(id: number): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/${id}/recommendations`);
  }

  getUserRecentlyWatched(id: number): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/${id}/recently-watched`);
  }

  getUserLists(id: number): Observable<CustomList[]> {
    return this.http.get<CustomList[]>(`${this.apiUrl}/${id}/lists`);
  }

  getUserHighestRated(id: number): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/${id}/highest-rated`);
  }

  getUserFollowing(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${id}/following`);
  }

  getUserFollowingReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${id}/following-reviews`);
  }

  getUserFollowers(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${id}/followers`);
  }
}

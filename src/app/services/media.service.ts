import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Media, Review, Movie, TvSeries } from '../models/media.model';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  likeMedia(id: number, id1: number): any {
    throw new Error('Method not implemented.');
  }
  getMovieGenres(): Observable<{ id: number, name: string }[]> {
    const dummyMovieGenres = [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
      { id: 3, name: 'Drama' },
      { id: 4, name: 'Horror' },
      { id: 5, name: 'Sci-Fi' }
    ];
    return of(dummyMovieGenres);
  }
  getTvGenres(): Observable<{ id: number, name: string }[]> {
    const dummyTvGenres = [
      { id: 1, name: 'Documentary' },
      { id: 2, name: 'Reality' },
      { id: 3, name: 'Fantasy' },
      { id: 4, name: 'Thriller' },
      { id: 5, name: 'Animation' }
    ];
    return of(dummyTvGenres);
  }
  searchAll(searchParams: { query: string; type: string; yearFrom: number | null; yearTo: number | null; genres: number[]; minRating: number; sortBy: string; sortDirection: string; contentRating: string; knownFor: string; }): Observable<any[]>  {
    const dummyMovies = [
      { id: 1, title: 'Mock Movie 1', genre_ids: [1, 2], vote_average: 7.5 },
      { id: 2, title: 'Mock Movie 2', genre_ids: [3, 4], vote_average: 8.0 }
    ];
    return of(dummyMovies);
  }
  searchPeople(searchParams: { query: string; type: string; yearFrom: number | null; yearTo: number | null; genres: number[]; minRating: number; sortBy: string; sortDirection: string; contentRating: string; knownFor: string; }): Observable<any[]>  {
    const dummyMovies = [
      { id: 1, title: 'Mock Movie 1', genre_ids: [1, 2], vote_average: 7.5 },
      { id: 2, title: 'Mock Movie 2', genre_ids: [3, 4], vote_average: 8.0 }
    ];
    return of(dummyMovies);
  }
  searchMoviesWithParams(searchParams: { query: string; type: string; yearFrom: number | null; yearTo: number | null; genres: number[]; minRating: number; sortBy: string; sortDirection: string; contentRating: string; knownFor: string; }): Observable<any[]> {
    const dummyMovies = [
      { id: 1, title: 'Mock Movie 1', genre_ids: [1, 2], vote_average: 7.5 },
      { id: 2, title: 'Mock Movie 2', genre_ids: [3, 4], vote_average: 8.0 }
    ];
    return of(dummyMovies);
  }
  searchTvSeriesWithParams(searchParams: { query: string; type: string; yearFrom: number | null; yearTo: number | null; genres: number[]; minRating: number; sortBy: string; sortDirection: string; contentRating: string; knownFor: string; }): Observable<any[]>  {
    const dummyMovies = [
      { id: 1, title: 'Mock Movie 1', genre_ids: [1, 2], vote_average: 7.5 },
      { id: 2, title: 'Mock Movie 2', genre_ids: [3, 4], vote_average: 8.0 }
    ];
    return of(dummyMovies);
  }
  searchPeopleWithParams(searchParams: { query: string; type: string; yearFrom: number | null; yearTo: number | null; genres: number[]; minRating: number; sortBy: string; sortDirection: string; contentRating: string; knownFor: string; }): Observable<any[]>  {
    const dummyMovies = [
      { id: 1, title: 'Mock Movie 1', genre_ids: [1, 2], vote_average: 7.5 },
      { id: 2, title: 'Mock Movie 2', genre_ids: [3, 4], vote_average: 8.0 }
    ];
    return of(dummyMovies);
  }
  private apiUrl = `${environment.apiUrl}/api/media`;
  private movieApiUrl = `${environment.apiUrl}/api/movies`;
  private tvApiUrl = `${environment.apiUrl}/api/tv`;
  private omdbApiKey = '16532318'; // Replace with your OMDB API key
  private omdbApiUrl = 'https://www.omdbapi.com/';

  constructor(private http: HttpClient, private userService: UserService) { }

  getMedia(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.apiUrl}/${id}`);
  }

  getMediaWatchCount(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/watch-count`);
  }

  getMediaReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${id}/reviews`);
  }

  getMediaAverageRating(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/average-rating`);
  }

  searchMedia(query: string): Observable<Media[]> {
    const body = { };
    const params = new HttpParams().set('query', query);
    return this.http.get<{content:Media[]}>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => response.content)
    );
  }

  getMediaByGenre(genre: string): Observable<Media[]> {
    console.log(genre);
    const body = { };
    return this.http.get<{ content: Media[] }>(`${this.apiUrl}/genre/${genre}`, body).pipe(
      map(response => {
        console.log(response);
        return response.content;
      })
    );
  }

  createMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(`${this.movieApiUrl}`, movie);
  }

  searchMovies(query: string): Observable<Movie[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Movie[]>(`${this.movieApiUrl}/search`, { params });
  }

  createTvSeries(tvSeries: Partial<TvSeries>): Observable<TvSeries> {
    return this.http.post<TvSeries>(`${this.tvApiUrl}`, tvSeries);
  }

  searchTvSeries(query: string): Observable<TvSeries[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<TvSeries[]>(`${this.tvApiUrl}/search`, { params });
  }
  // Fetch trending movies from OMDB API
  getMoviesByOMDB(query: string): Observable<string[]> {
    const url = `${this.omdbApiUrl}?apikey=${this.omdbApiKey}&s=${query}`;
    return this.http.get<{ Search: { Title: string }[] }>(url).pipe(
      map(response => {
        console.log(response);
        return response.Search.map(movie => movie.Title);
      })
    );
  }

  getImdbtop10(): Observable<any> { 
    return this.http.get<Movie[]>(`${this.apiUrl}/top10`);
   }

  postMediaList(mediaList: String []): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/details`, mediaList);
  }

  // Fetch movie details by ID
  getMovieDetailsById(id: string): Observable<any> {
    const url = `${this.omdbApiUrl}?apikey=${this.omdbApiKey}&i=${id}`;
    return this.http.get(url);
  }

  getMoviesByAdvancedSearch(prompt: string): Observable<Media[]> {
    return this.http.post<Media []>(`${this.apiUrl}/advanced-search`, prompt);
  }

  getSimilarMedia(movieId: number, genreIds: number[]): Observable<any> {
    // Mock implementation
    return of({
      results: [
        {
          id: 1,
          title: 'Similar Movie 1',
          poster_path: 'path/to/poster1.jpg',
          backdrop_path: 'path/to/backdrop1.jpg',
          release_date: '2022-01-01',
          overview: 'Overview of similar movie 1',
          genre_ids: genreIds,
          vote_average: 7.5
        },
        {
          id: 2,
          title: 'Similar Movie 2',
          poster_path: 'path/to/poster2.jpg',
          backdrop_path: 'path/to/backdrop2.jpg',
          release_date: '2022-02-01',
          overview: 'Overview of similar movie 2',
          genre_ids: genreIds,
          vote_average: 8.0
        }
      ]
    });
  }

  isInWatchlist(userId: number, movieId: number): Observable<boolean> {
    return this.userService.getUserWatchlist(userId).pipe(
      map(watchlist => watchlist.some((watchedItem: { media: { id: number; }; }) => watchedItem.media.id === movieId))
    );
  }

  getUserRating(userId: number, movieId: number): Observable<number> {
    return this.userService.getUserReviews(userId).pipe(
      map(reviews => {
        const review = reviews.find(r => r.media.id === movieId);
        return review ? review.likes : 0;
      })
    );
  }
}
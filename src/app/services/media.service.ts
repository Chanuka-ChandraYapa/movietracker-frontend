import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Media, Review, Movie, TvSeries, Tag } from '../models/media.model';
import { WatchedItem } from '../models/user.model';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { response } from 'express';

export interface SearchParams {
  query: string;
  type: string;
  yearFrom: number | null;
  yearTo: number | null;
  genres: number[];
  minRating: number;
  sortBy: string;
  sortDirection: string;
  contentRating: string;
  knownFor: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  likeMedia(id: number, id1: number): any {
    throw new Error('Method not implemented.');
  }
  getMovieGenres(): Observable<{ id: number, name: string }[]> {
    return this.http.get<any>(`${this.apiUrl}/genre`);
  }
  getTvGenres(): Observable<{ id: number, name: string }[]> {
    return this.http.get<any>(`${this.apiUrl}/genre`);
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
    return this.http.get<{content:Review[]}>(`${this.apiUrl}/${id}/reviews`, {}).pipe(
      map(response=> response.content)
    );
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

  searchAll(
    searchParams: SearchParams,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'title',
    sortDirection: string = 'asc'
  ): Observable<PageResponse<any>> {
    let params = this.buildSearchParams(searchParams, page, size, sortBy, sortDirection);
    return this.http.get<PageResponse<any>>(`${this.apiUrl}/search/all`, { params });
  }

  searchMoviesWithParams(
    searchParams: SearchParams,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'title',
    sortDirection: string = 'asc'
  ): Observable<PageResponse<any>> {
    let params = this.buildSearchParams(searchParams, page, size, sortBy, sortDirection);
    return this.http.get<PageResponse<any>>(`${this.apiUrl}/search/movies`, { params });
  }

  searchTvSeriesWithParams(
    searchParams: SearchParams,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'title',
    sortDirection: string = 'asc'
  ): Observable<PageResponse<any>> {
    let params = this.buildSearchParams(searchParams, page, size, sortBy, sortDirection);
    return this.http.get<PageResponse<any>>(`${this.apiUrl}/search/tv`, { params });
  }

  searchPeople(
    searchParams: SearchParams,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    sortDirection: string = 'asc'
  ): Observable<PageResponse<any>> {
    let params = this.buildSearchParams(searchParams, page, size, sortBy, sortDirection);
    return this.http.get<PageResponse<any>>(`${this.apiUrl}/search/people`, { params });
  }

  private buildSearchParams(
    searchParams: SearchParams,
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string
  ): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    // Add search parameters as needed
    if (searchParams.query) params = params.set('query', searchParams.query);
    if (searchParams.type) params = params.set('type', searchParams.type);
    if (searchParams.yearFrom) params = params.set('yearFrom', searchParams.yearFrom.toString());
    if (searchParams.yearTo) params = params.set('yearTo', searchParams.yearTo.toString());
    if (searchParams.genres && searchParams.genres.length > 0) {
      searchParams.genres.forEach(genre => {
        params = params.append('genres', genre.toString());
      });
    }
    if (searchParams.minRating) params = params.set('minRating', searchParams.minRating.toString());
    if (searchParams.contentRating) params = params.set('contentRating', searchParams.contentRating);
    if (searchParams.knownFor) params = params.set('knownFor', searchParams.knownFor);

    return params;
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
    return this.http.get<{content: Movie[]}>(`${this.movieApiUrl}/search`, { params }).pipe(
      map(response => response.content)
    );
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

  getSimilarMedia(movieId: number): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/similar-media/${movieId}`);
  }

  getMoviesFromDirector(directors: string[]): Observable<Media[]>{
    console.log(directors);
    return this.http.post<Media[]>(`${this.apiUrl}/media-by-director`, directors);
  }

  isInWatchlist(userId: number, movieId: number): Observable<boolean> {
    return this.userService.getUserWatchlist(userId).pipe(
      map(watchlist => watchlist.some((watchedItem: { media: { id: number; }; }) => watchedItem.media.id === movieId))
    );
  }
  
  getWatchedItem(userId: number, movieId: number): Observable<WatchedItem> {
    return this.userService.getUserWatchlist(userId).pipe(
      map(watchlist => watchlist.find((watchedItem: { media: { id: number; }; }) => watchedItem.media.id === movieId)),
      map(watchedItem => {
        if (!watchedItem) {
          throw new Error('Watched item not found');
        }
        return watchedItem;
      })
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

  updateActor(actorId: number, actorImageUrl: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${actorId}/actor`, { actorImageUrl });
  }

  getMovieOfTheDay(dateSeed: string): Observable<Media | null> {
    // Option 1: If you have a dedicated endpoint for movie of the day
    return this.http.get<Media>(`${this.apiUrl}/movie-of-the-day`, {
      params: new HttpParams().set('seed', dateSeed)
    }).pipe(
      catchError(error => {
        console.error('Error fetching movie of the day:', error);
        // Fallback option: Get a popular movie instead
        return of(null); // or any other fallback observable
      })
    );
  }
  getMovieTags(movieId: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/${movieId}/tags`);
  }
  
  /**
   * Get all available tags in the system
   */
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`);
  }
  
  /**
   * Add a tag to a movie
   */
  addTagToMovie(movieId: number, tag: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${movieId}/tags`, [tag]);
  }
  
  /**
   * Remove a tag from a movie
   */
  removeTagFromMovie(movieId: number, tag: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/movies/${movieId}/tags/${encodeURIComponent(tag)}`);
  }
  
  /**
   * Search for movies by tag
   */
  getMoviesByTag(tag: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/tags/${encodeURIComponent(tag)}/movies`, {
      params: { page: page.toString() }
    });
  }
}
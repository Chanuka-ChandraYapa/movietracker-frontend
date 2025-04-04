import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin, of, combineLatest, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { MediaService } from '../../services/media.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Media, Genre, Tag } from '../../models/media.model';
import { WatchedItem, User } from '../../models/user.model'

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
  standalone: false
})
export class DiscoverComponent implements OnInit {
  currentUserId: number | undefined;
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;
  trendingMedia: Media[] = [];
  recommendedMedia: Media[] = [];
  recentlyWatchedGenreMedia: Media[] = [];
  topRatedMedia: Media[] = [];
  movieOfTheDay: Media | null = null;
  friendsActivity: WatchedItem[] = [];
  directorShowcase: Media[] = [];
  similarToFavorites: Media[] = [];
  moviesByTag: Media[] = [];
  imdbtop10: Media[] = [];
  
  allGenres: Genre[] = [];
  genreFilters: { id: number; name: string; selected: boolean }[] = [];
  selectedGenreName: string = '';
  genreMedia: Media[] = [];
  
  allTags: Tag[] = [];
  featuredTag: string = '';
  
  searchQuery: string = '';
  advancedSearchPrompt: string = '';
  searchResults: Media[] = [];
  filteredSearchResults: Media[] = [];
  
  isLoading: boolean = true;
  showAdvancedSearch: boolean = false;
  showMoodPicker: boolean = false;
  
  moods: { name: string, tags: string[], posterUrl: string }[] = [
    { name: 'Happy', tags: ['comedy', 'feel-good', 'light-hearted'], posterUrl: '/assets/moods/happy.jpg' },
    { name: 'Thoughtful', tags: ['drama', 'philosophical', 'character-study'], posterUrl: '/assets/moods/thoughtful.jpg' },
    { name: 'Thrilling', tags: ['action', 'adventure', 'suspense'], posterUrl: '/assets/moods/thrilling.jpg' },
    { name: 'Scary', tags: ['horror', 'thriller', 'suspense'], posterUrl: '/assets/moods/scary.jpg' },
    { name: 'Romantic', tags: ['romance', 'love', 'relationship'], posterUrl: '/assets/moods/romantic.jpg' },
    { name: 'Nostalgic', tags: ['classic', 'retro', '80s', '90s'], posterUrl: '/assets/moods/nostalgic.jpg' },
  ];
  
  selectedMood: string = '';
  timeWindow = new BehaviorSubject<string>('week');
  
  constructor(
    private mediaService: MediaService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
   }

  ngOnInit(): void {
    this.currentUser$.pipe(
      tap(user => {
        this.currentUser = user;
        this.currentUserId = user?.id || 0;
      }),
      switchMap(user => {
        this.isLoading = true;
        
        // Fetch all genres for filtering
        const genresObservable = this.mediaService.getMovieGenres().pipe(
          tap(genres => {
            this.allGenres = genres.map(genre => ({ ...genre, media: [] }));
            this.genreFilters = genres.map(g => ({...g, selected: false}));
          }),
          catchError(() => of([]))
        );
        
        // Fetch all available tags
        const tagsObservable = this.mediaService.getAllTags().pipe(
          tap(tags => {
            this.allTags = tags;
            // Pick a random tag to feature
            if (tags.length > 0) {
              const randomIndex = Math.floor(Math.random() * tags.length);
              this.featuredTag = tags[randomIndex].name;
              this.loadMoviesByTag(this.featuredTag);
            }
          }),
          catchError(() => of([]))
        );
        
        // Fetch trending media
        const trendingObservable = this.mediaService.getImdbtop10().pipe(
          tap(media => this.trendingMedia = media),
          catchError(() => of([]))
        );
        
        // Recommendations based on user history
        const recommendationsObservable = user ? 
          this.userService.getUserRecommendations(user.id).pipe(
            tap(media => this.recommendedMedia = media),
            catchError(() => of([]))
          ) : of([]);
        
        // Fetch movie of the day
        const today = new Date().toISOString().split('T')[0];
        const movieOfDayObservable = this.mediaService.getMovieOfTheDay(today).pipe(
          tap(movie => this.movieOfTheDay = movie),
          catchError(() => of(null))
        );
        
        // IMDB top 10
        const imdbTop10Observable = this.mediaService.getImdbtop10().pipe(
          tap(movies => this.imdbtop10 = movies),
          catchError(() => of([]))
        );
        
        return forkJoin({
          genres: genresObservable,
          tags: tagsObservable,
          trending: trendingObservable,
          recommendations: recommendationsObservable,
          movieOfDay: movieOfDayObservable,
          imdbTop10: imdbTop10Observable
        }).pipe(
          // After initial data is loaded, fetch secondary data
          switchMap(() => {
            if (!user) return of(null);
            
            // Get recently watched for genre-based recommendations
            return this.userService.getUserRecentlyWatched(user.id).pipe(
              take(1),
              switchMap(recentlyWatched => {
                console.log("recent", recentlyWatched);
                if (recentlyWatched.length === 0) return of(null);
                
                // Extract genres from recently watched
                const recentGenres = Array.from(new Set(
                  recentlyWatched.flatMap(item => item.media.genres.map(g => g.name))
                ));
                
                if (recentGenres.length > 0) {
                  // Pick a random genre from recently watched
                  const randomGenre = recentGenres[Math.floor(Math.random() * recentGenres.length)];
                  this.selectedGenreName = randomGenre;
                  
                  // Fetch media for that genre
                  return this.mediaService.getMediaByGenre(randomGenre).pipe(
                    tap(media => this.recentlyWatchedGenreMedia = media),
                    catchError(() => of([]))
                  );
                }
                return of([]);
              }),
              // Get friends' activity
              switchMap(() => {
                return this.userService.getUserFollowing(user.id).pipe(
                  switchMap(following => {
                    if (following.length === 0) return of([]);
                    
                    // Get recently watched items from friends
                    const followingActivities = following.map(friend => 
                      this.userService.getUserRecentlyWatched(friend.id).pipe(
                        take(1),
                        catchError(() => of([]))
                      )
                    );
                    
                    return followingActivities.length > 0 
                      ? forkJoin(followingActivities).pipe(
                          map(activities => activities.flat().slice(0, 10)),
                          tap(activities => this.friendsActivity = activities),
                          catchError(() => of([]))
                        )
                      : of([]);
                  }),
                  catchError(() => of([]))
                );
              }),
              // Get director showcase from user's highest rated
              switchMap(() => {
                return this.userService.getUserHighestRated(user.id).pipe(
                  take(1),
                  switchMap(highestRated => {
                    if (highestRated.length === 0) return of([]);
                    console.log("highestrated", highestRated);
                    // Extract directors from highest rated
                    const directors = highestRated
                      .filter(item => item.media.director)
                      .map(item => item.media.director)
                      .filter(Boolean)
                      .slice(0, 2);
                    
                    if (directors.length > 0) {
                      return this.mediaService.getMoviesFromDirector(directors.filter((director): director is string => !!director)).pipe(
                        tap(media => this.directorShowcase = media),
                        catchError(() => of([]))
                      );
                    }
                    return of([]);
                  }),
                  catchError(() => of([]))
                );
              }),
              // Get similar to favorites
              switchMap(() => {
                return this.userService.getUserHighestRated(user.id).pipe(
                  take(1),
                  switchMap(highestRated => {
                    if (highestRated.length === 0) return of([]);
                    
                    const favoriteId = highestRated[0]?.media.id;
                    if (favoriteId) {
                      return this.mediaService.getSimilarMedia(favoriteId).pipe(
                        tap(media => this.similarToFavorites = media),
                        catchError(() => of([]))
                      );
                    }
                    return of([]);
                  }),
                  catchError(() => of([]))
                );
              })
            );
          })
        );
      })
    ).subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
    
    // Subscribe to time window changes for trending data refreshes
    this.timeWindow.pipe(
      switchMap(window => {
        return this.mediaService.getImdbtop10();
      })
    ).subscribe(media => {
      this.trendingMedia = media;
    });
  }
  
  searchMovies(): void {
    if (!this.searchQuery.trim()) return;
    
    this.isLoading = true;
    this.mediaService.searchMovies(this.searchQuery).subscribe({
      next: results => {
        this.searchResults = results;
        this.filteredSearchResults = results;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  advancedSearch(): void {
    if (!this.advancedSearchPrompt.trim()) return;
    
    this.isLoading = true;
    this.mediaService.getMoviesByAdvancedSearch(this.advancedSearchPrompt).subscribe({
      next: results => {
        this.searchResults = results;
        this.filteredSearchResults = results;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  get movieActors(): string {
    return this.movieOfTheDay?.actors?.map((actor: any) => actor.name).join(', ') || '';
}
  
  toggleGenreFilter(genreId: number): void {
    this.genreFilters.forEach((g, i) => {
      this.genreFilters[i].selected = g.id === genreId;
    });
    
    // Apply filters
    this.applyFilters();
  }
  get selectedGenre(): string {

    const selectedGenre = this.genreFilters?.find(genre => genre.selected);

    return selectedGenre?.name || 'a Genre';

}
  applyFilters(): void {
    // Implement filtering logic here
    const selectedGenres = this.genreFilters
      .filter(g => g.selected)
      .map(g => g.name);
      
    if (selectedGenres.length === 0) {
      // Reset to default view if no filters selected
      this.ngOnInit();
      return;
    }
    
    // For simplicity, just use the first selected genre
    if (selectedGenres.length > 0) {
      this.isLoading = true;
      this.mediaService.getMediaByGenre(selectedGenres[0]).subscribe({
        next: media => {
          this.genreMedia = media;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }

    if (this.searchResults.length > 0) {
      this.filteredSearchResults = this.searchResults.filter(media =>
      media.genres.some(genre => selectedGenres.includes(genre.name))
      );
    }
  }
  
  changeTimeWindow(window: string): void {
    this.timeWindow.next(window);
  }
  
  loadMoviesByTag(tag: string): void {
    this.isLoading = true;
    this.mediaService.getMoviesByTag(tag).subscribe({
      next: response => {
        this.moviesByTag = response.content || response;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  selectMood(mood: string): void {
    this.selectedMood = mood;
    const selectedMoodObj = this.moods.find(m => m.name === mood);
    
    if (selectedMoodObj) {
      this.isLoading = true;
      // Create an advanced search prompt based on mood tags
      const moodPrompt = `Movies that are ${selectedMoodObj.tags.join(' or ')}`;
      this.mediaService.getMoviesByAdvancedSearch(moodPrompt).subscribe({
        next: results => {
          this.searchResults = results;
          this.isLoading = false;
          this.showMoodPicker = false;
        },
        error: () => {
          this.isLoading = false;
          this.showMoodPicker = false;
        }
      });
    }
  }
  
  onAddToWatchlist(media: Media): void {
    // Implement watchlist functionality
    // this.userService.addToWatchlist(this.currentUserId, media.id).subscribe();
  }
  
  onLikeMedia(media: Media): void {
    // Implement like functionality
    // this.userService.rateMedia(this.currentUserId, media.id, 5).subscribe();
  }
  
  onMediaClick(media: Media): void {
    this.router.navigate(['/movies', media.id]);
  }
  
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
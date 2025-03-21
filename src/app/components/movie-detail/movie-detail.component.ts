import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MediaService } from '../../services/media.service';
import { AuthService } from '../../services/auth.service';
import { Media, TvSeason } from '../../models/media.model';
import { User, WatchedItem } from '../../models/user.model';
import { Observable, forkJoin, of, switchMap, catchError } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WatchlistService } from '../../services/watchlist.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


enum WatchStatus {
  WANT_TO_WATCH = 'WANT_TO_WATCH',
  WATCHING = 'WATCHING',
  WATCHED = 'WATCHED'
}

interface WatchlistDto {
  status: WatchStatus;
  rating?: number;
  watchedDate?: string;
  rewatch?: boolean;
  rewatchCount?: number;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone:false
})
export class MovieDetailComponent implements OnInit {

  currentUser$: Observable<User | null>;
  movie: Media | null = null;
  similarMovies: Media[] = [];
  directorMovies: Media[] = [];
  isLoading = true;
  error: string | null = null;
  isInWatchlist = false;
  showWatchlistModal = false;
  watchlistForm: FormGroup;
  watchedDetails: WatchedItem = {} as WatchedItem;
  userRating = 0;
  cast: any[] = [];
  crew: { directors: any[], writers: any[], producers: any[]} = { directors: [], writers: [], producers:[] };
  trailerUrl: SafeResourceUrl | null = null;
  activeTab = 'overview';
  selectedSeason: number = 1;
  expandedEpisodes: Set<number> = new Set();
  private youtubeApiKey = environment.youtubeApiKey; 
  private apiKey = environment.googleSearchApiKey;
  private cseId = environment.googleCseId;
  private trailerLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private mediaService: MediaService,
    private authService: AuthService,
    private watchListService: WatchlistService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.watchlistForm = this.fb.group({
      status: [WatchStatus.WANT_TO_WATCH],
      rating: [null],
      watchedDate: [null],
      rewatch: [false],
      rewatchCount: [1]
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    if (this.movie?.mediaType === 'tv' && this.movie.seasons && this.movie.seasons.length > 0) {
      this.selectedSeason = this.movie.seasons[0].seasonNumber;
    }

    this.watchlistForm.get('status')?.valueChanges.subscribe(value => {
      if (value === WatchStatus.WATCHED) {
        this.watchlistForm.get('watchedDate')?.setValue(new Date().toISOString().substring(0, 10));
      }
    });
    
    this.watchlistForm.get('rewatch')?.valueChanges.subscribe(isRewatch => {
      if (!isRewatch) {
        this.watchlistForm.get('rewatchCount')?.setValue(1);
      }
    });
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) {
          this.error = 'Movie ID not found';
          this.isLoading = false;
          return of(null);
        }
        
        return forkJoin({
          movieDetails: this.mediaService.getMedia(id),
          // credits: this.mediaService.getMediaCredits(id),
          // videos: this.mediaService.getMediaVideos(id)
        }).pipe(
          catchError(error => {
            this.error = 'Failed to load movie details';
            this.isLoading = false;
            console.error('Error fetching movie details:', error);
            return of(null);
          })
        );
      })
    ).subscribe(result => {
      if (result) {
        // result.movieDetails.genres = JSON.parse(result.movieDetails.genres);
        this.trailerLoaded = false;
        this.processMovieData(result.movieDetails);
        this.processCastAndCrew(result.movieDetails);
        // this.processVideoData(result.videos);
        this.fetchSimilarMovies(result.movieDetails.id);
        this.fetchMoviesFromDirector();
        this.getWatchedItem();
        this.checkUserInteractions(result.movieDetails.id);
        if (this.activeTab == "media") {
          this.fetchTrailer();
        }
        this.isLoading = false;
      }
    });
  }

  onMediaClick($event: Media) {
    throw new Error('Method not implemented.');
  }
  onLikeMedia($event: Media) {
    throw new Error('Method not implemented.');
  }
  onAddToWatchlist($event: Media) {
    throw new Error('Method not implemented.');
  }

  private processMovieData(movieData: any): void {
    if (movieData) {
      this.movie = movieData;
      if (this.movie?.numberOfSeasons && this.movie?.numberOfSeasons > 0){
        this.movie.mediaType = 'tv';
      }

      console.log("current movie: ",this.movie);
    }
  }
  private processCastAndCrew(creditsData: any): void {
    if (creditsData) {
      this.cast = (creditsData.actors || []).slice(0, 10);

      for (const actor of this.cast) {
        if (!actor.actorUrl) {

        this.searchActorImage(actor.name).subscribe({
          next: (response: any) => {
            if (response.items && response.items.length > 0) {
              actor.actorUrl = response.items[0].link; // Get the first image URL
              this.mediaService.updateActor(actor.id, actor.actorUrl).subscribe({
                next: () => {
                  console.log('Actor image updated');
                },
                error: (error) => {
                  console.error('Error updating actor image:', error);
                }
              });
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
        console.log("api called")
      }
      }
      
      // Get director, writers, and cinematographers
      if (creditsData) {
        // const directors = creditsData.crew.filter((person: any) => person.job === 'Director');
        const directors = creditsData.director ? creditsData.director.split(',').map((name: string) => ({ name: name.trim() })) : [];
        const writers = creditsData.writer ? creditsData.writer.split(',').map((name: string) => ({ name: name.trim() })) : [];
        const producers = creditsData.producer ? creditsData.producer.split(',').map((name: string) => ({ name: name.trim() })) : [];
        // const cinematographers = creditsData.crew.filter((person: any) => 
        //   person.job === 'Director of Photography' || person.job === 'Cinematographer');
        
        this.crew = {
          directors,
          writers,
          producers
        };
      }
    }
  }

  searchActorImage(actorName: string) {
    const url = `https://www.googleapis.com/customsearch/v1`;
    const params = {
      q: actorName,
      searchType: 'image',
      key: this.apiKey,
      cx: this.cseId,
      num: 1, // Limit to 1 result
    };

    return this.http.get(url, { params });
  }

  // private processVideoData(videoData: any): void {
  //   if (videoData && videoData.results && videoData.results.length > 0) {
  //     // Find trailer
  //     const trailer = videoData.results.find((video: any) => 
  //       video.type === 'Trailer' && video.site === 'YouTube');
      
  //     if (trailer) {
  //       this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //         `https://www.youtube.com/embed/${trailer.key}`
  //       );
  //     }
  //   }
  // }

  private fetchSimilarMovies(movieId: number): void {
    if (!movieId) {
      return;
    }

    this.mediaService.getSimilarMedia(movieId).subscribe(
      movies => {
        this.similarMovies = movies;
      },
      error => {
        console.error('Error fetching similar movies:', error);
      }
    );
    
  }

  private fetchMoviesFromDirector(): void {
    if (!this.crew.directors) {
      return;
    }

    this.mediaService.getMoviesFromDirector(this.crew.directors.map(director => director.name)).subscribe(
      movies => {
      this.directorMovies = movies.filter(movie => movie.id !== this.movie?.id);
      },
      error => {
      console.error('Error fetching movies from director:', error);
      }
    );
    
  }


  private checkUserInteractions(movieId: number): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        // Check if movie is in user's watchlist
        this.mediaService.isInWatchlist(user.id, movieId).subscribe(
          result => {
            this.isInWatchlist = result;
          },
          error => {
            console.error('Error checking watchlist status:', error);
          }
        );
        
        // Get user's rating for this movie
        this.mediaService.getUserRating(user.id, movieId).subscribe(
          rating => {
            this.userRating = rating || 0;
          },
          error => {
            console.error('Error getting user rating:', error);
          }
        );
      }
    });
  }

  checkWatchlistStatus(): void {
    this.currentUser$.subscribe(user => {
      if (user && this.movie) {
        this.mediaService.isInWatchlist(user.id, this.movie.id).subscribe(
          status => {
            this.isInWatchlist = status;
          },
          error => {
            console.error('Error checking watchlist status:', error);
          }
        );
      }
    });
  }

  getWatchedItem(): void {
    this.watchedDetails = {} as WatchedItem;
    this.currentUser$.subscribe(user => {
      if (user && this.movie) {
        this.mediaService.getWatchedItem(user.id, this.movie.id).subscribe(
          watchedItem => {
            if (watchedItem) {
              this.watchedDetails = watchedItem;
              this.watchlistForm.get('status')?.setValue(watchedItem.status);
              this.watchlistForm.get('rating')?.setValue(watchedItem.rating);
              this.watchlistForm.get('watchedDate')?.setValue(watchedItem.watchedDate);
              this.watchlistForm.get('rewatch')?.setValue(watchedItem.rewatch);
              this.watchlistForm.get('rewatchCount')?.setValue(watchedItem.rewatchCount);
              this.userRating = watchedItem.rating || 0;
            }
          },
          error => {
            console.error('Error getting watched item:', error);
          }
        );
      }
    });
  }

  toggleWatchlist(): void {
      this.showWatchlistModal = true;
  }

  removeFromWatchlist(): void {
    if (this.isInWatchlist) {
      // Remove from watchlist without showing modal
      this.currentUser$.subscribe(user => {
        if (user && this.movie) {
          this.watchListService.removeFromWatchlist(user.id, this.movie.id).subscribe(
            () => {
              this.isInWatchlist = false;
              if (this.watchedDetails) {
                this.watchedDetails.status = "";
              }
            },
            error => {
              console.error('Error removing from watchlist:', error);
            }
          );
        }
      });
    } 
  }

  getButtonIcon(): string {
    switch (this.watchedDetails?.status) {
      case 'WATCHED':
        return '✓';
      case 'WATCHING':
        return '▶';
      case 'WANT_TO_WATCH':
        return '+';
      default:
        return '+';
    }
  }

  getButtonLabel(): string {
    switch (this.watchedDetails?.status) {
      case 'WATCHED':
        return 'Watched';
      case 'WATCHING':
        return 'Watching';
      case 'WANT_TO_WATCH':
        return 'Want to Watch';
      default:
        return 'Add to Watchlist';
    }
  }

  getButtonTitle(): string {
    switch (this.watchedDetails?.status) {
      case 'WATCHED':
        return 'Mark as Want to Watch';
      case 'WATCHING':
        return 'Mark as Watched';
      case 'WANT_TO_WATCH':
        return 'Mark as Watching';
      default:
        return 'Add to Watchlist';
    }
  }

  closeModal(event: MouseEvent): void {
    // Close modal only if backdrop or close button is clicked
    if (
      (event.target as HTMLElement).classList.contains('modal-backdrop') ||
      (event.target as HTMLElement).classList.contains('close-btn') ||
      (event.target as HTMLElement).classList.contains('cancel-btn')
    ) {
      this.showWatchlistModal = false;
    }
  }
  
  setRating(rating: number): void {
    this.watchlistForm.get('rating')?.setValue(rating);
  }
  
  saveWatchlist(): void {
    const watchlistData: WatchlistDto = {
      status: this.watchlistForm.get('status')?.value,
      rating: this.watchlistForm.get('status')?.value === WatchStatus.WATCHED ? 
        this.watchlistForm.get('rating')?.value : null,
      watchedDate: this.watchlistForm.get('status')?.value === WatchStatus.WATCHED ? 
        this.watchlistForm.get('watchedDate')?.value : null,
      rewatch: this.watchlistForm.get('status')?.value === WatchStatus.WATCHED ? 
        this.watchlistForm.get('rewatch')?.value : null,
      rewatchCount: this.watchlistForm.get('status')?.value === WatchStatus.WATCHED && 
        this.watchlistForm.get('rewatch')?.value ? 
        this.watchlistForm.get('rewatchCount')?.value : null
    };
    
    this.currentUser$.subscribe(user => {
      if (user && this.movie) {
        this.watchListService.addToWatchlistWithDetails(user.id, this.movie.id, watchlistData).subscribe(
          () => {
            this.isInWatchlist = true;

              this.watchedDetails.status = watchlistData.status;
              if (watchlistData.rating){
                this.userRating = watchlistData.rating;
              }

            this.showWatchlistModal = false;
          },
          error => {
            console.error('Error adding to watchlist:', error);
          }
        );
      }
    });
  }

  rateMovie(rating: number): void {
    this.currentUser$.subscribe(user => {
      if (user && this.movie) {
        // this.mediaService.rateMedia(user.id, this.movie.id, rating).subscribe(
        //   () => {
        //     this.userRating = rating;
        //   },
        //   error => {
        //     console.error('Error rating movie:', error);
        //   }
        // );
      }
    });
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'media' && !this.trailerLoaded) {
      this.fetchTrailer();
    }
  }

  formatRuntime(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatMoney(amount: number): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString=="null") return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  fetchTrailer(): void {
    if (!this.movie || !this.movie.title) {
      return;
    }
    
    const searchQuery = `${this.movie.title} ${this.movie.year} trailer`;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&key=${this.youtubeApiKey}`;
    
    this.http.get(apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching trailer:', error);
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response && response.items && response.items.length > 0) {
        const videoId = response.items[0].id.videoId;
        // Create a safe URL for the iframe
        this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      } else {
        this.trailerUrl = null;
      }
      this.trailerLoaded = true;
    });
  }
    
  // Episodes tab methods
  selectSeason(seasonNumber: number): void {
    this.selectedSeason = seasonNumber;
    // Reset expanded episodes when changing seasons
    this.expandedEpisodes.clear();
  }
  
  getCurrentSeason(): TvSeason | null {
    if (!this.movie?.seasons) return null;
    return this.movie.seasons.find(season => season.seasonNumber === this.selectedSeason) || null;
  }
  
  toggleEpisodeDetails(episodeId: number): void {
    if (this.expandedEpisodes.has(episodeId)) {
      this.expandedEpisodes.delete(episodeId);
    } else {
      this.expandedEpisodes.add(episodeId);
    }
  }
  
  isEpisodeExpanded(episodeId: number): boolean {
    return this.expandedEpisodes.has(episodeId);
  }
}
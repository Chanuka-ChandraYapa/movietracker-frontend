import { AfterViewInit, Component, OnInit, AfterContentInit, OnDestroy, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MediaService } from '../../services/media.service';
import { Media } from '../../models/media.model';
import { User } from '../../models/user.model';
import { allPosterUrls } from '../../models/media.model';
import { Observable, take } from 'rxjs';
import { UserService } from '../../services/user.service';
import { error } from 'console';
import { WatchlistService } from '../../services/watchlist.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;
  trendingMedia: Media[] = [];
  reccomendedMedia: Media[] = [];
  isLoading = true;
  isLoading2 = true;
  isLoading3 = true;
  errorLoading = false;
  today = new Date();
  movieOfTheDay: Media | null = null;
  backgroundImages = [
    'https://www.everysingleframe.com/images/Blade_title.png',
    'https://www.everysingleframe.com/images/amelie_title.jpeg',
    'https://www.everysingleframe.com/images/LaLa_title.png'
  ];
  
  currentBgIndex = 0;
  currentBg = this.backgroundImages[0];
  allPosterUrls: string[] = allPosterUrls; // Will be loaded from CSV
  posterUrls: string[] = [    
    'https://www.everysingleframe.com/images/Blade_title.png',
    'https://www.everysingleframe.com/images/amelie_title.jpeg',
    'https://www.everysingleframe.com/images/LaLa_title.png']; // Currently displayed posters
  posterInterval: any;
  isPostersLoaded = false;

  constructor(
    private authService: AuthService,
    private mediaService: MediaService,
    private userService: UserService,
    private watchService: WatchlistService,
    private router: Router,
    private notificationService: NotificationService,
    private ngZone: NgZone,
    private http: HttpClient,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }
  

  ngOnInit(): void {

    // if (!this.isPostersLoaded) {
    //   this.isPostersLoaded = true;
    //   this.loadPostersFromTextFile();
    // }

    this.ngZone.runOutsideAngular(() => {
      this.posterInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.updateRandomPosters();
        });
      }, 50000);
    });

    this.fetchTrendingMedia();
    this.fetchReccomendedMedia();
    this.loadMovieOfTheDay();
  }

  loadPostersFromTextFile(): void {
    // Using HttpClient to fetch the text file
    this.http.get('assets/movies.txt', { responseType: 'text' }).pipe(take(1))
      .subscribe(data => {
        // Split the text file by new lines to get individual URLs
        this.allPosterUrls = data.split('\n')
          .map(url => url.trim())
          .filter(url => url.length > 0); // Remove any empty lines
        
        
      if (this.allPosterUrls.length == 0) {
        this.updateRandomPosters(); // Only update posters ONCE
      }
      }, error => {
        console.error('Error loading posters from text file:', error);
      });
  }

  setupPosterInterval(): void {
    // Clear any existing interval first
    if (this.posterInterval) {
      clearInterval(this.posterInterval);
    }
  }
  
  updateRandomPosters(): void {
    // Select 3 random posters
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * this.allPosterUrls.length);
      this.posterUrls[i] = this.allPosterUrls[randomIndex];
    }
  }
  
  ngOnDestroy(): void {
    if (this.posterInterval) {
      clearInterval(this.posterInterval);
    }
  }

  ngAfterViewInit(): void {
    // this.fetchTrendingMedia();
    // this.fetchReccomendedMedia();
    }

  ngAfterContentInit(): void {
    // setInterval(() => {
    //   this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
    //   this.currentBg = this.backgroundImages[this.currentBgIndex];
    // }, 5000);

  }

  onAddToWatchlist(media: Media): void {
    // if(this.currentUser != null) {
    //   this.watchService.addToWatchlist(this.currentUser.id, media.id).subscribe(
    //     () => console.log('Added to watchlist:', media.title),
    //     (error) => console.error('Error adding to watchlist', error)
    //   );
    // }
  }

  onLikeMedia(media: Media): void {
    // this.mediaService.likeMedia(media.id).subscribe(
    //   () => console.log('Liked media:', media.title),
    //   (error) => console.error('Error liking media', error)
    // );
  }

  onMediaClick(media: Media): void {
    console.log('Media clicked:', media.title);
    // Additional tracking or analytics could go here
  }

  private fetchTrendingMedia(): void {
    console.log(this.currentUser$);
    // this.isLoading = true;
    this.mediaService.getImdbtop10().subscribe(
      (response: any) => {
        if (response) {
          this.trendingMedia = response.map((item: any) => ({
            id: item.id,
            title: item.title,
            posterUrl: item.posterUrl,
            backdropUrl: '', // OMDB API doesn't provide backdrop URLs
            releaseDate: item.year,
            year: item.year,
            overview: item.overview, // OMDB API doesn't provide overviews in search results
            genres: [], // OMDB API doesn't provide genres in search results
            mediaType: item.numberOfSeasons? "tv":"movie",
            runtime: 0, // OMDB API doesn't provide runtime in search results
            status: 'Released', // Default status
            averageRating: 0, // OMDB API doesn't provide ratings in search results
            watchCount: 0, // Default watch count
          }));
          this.isLoading = false;
          console.log(response);
        }
      },
      (error) => {
        console.error('Error fetching trending media:', error);
        this.isLoading = false;
      }
    );
  }

  private fetchReccomendedMedia(): void {
    console.log(this.currentUser$);
    // this.isLoading = true;
    this.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userService.getUserRecommendations(user.id).subscribe(
          (response: any) => {
            if (response) {
              this.reccomendedMedia = response.map((item: any) => ({
                id: item.id,
                title: item.title,
                posterUrl: item.posterUrl,
                backdropUrl: '', // OMDB API doesn't provide backdrop URLs
                releaseDate: item.year,
                year: item.year,
                overview: item.overview, // OMDB API doesn't provide overviews in search results
                genres: [], // OMDB API doesn't provide genres in search results
                mediaType: item.numberOfSeasons? "tv":"movie",
                runtime: 0, // OMDB API doesn't provide runtime in search results
                status: 'Released', // Default status
                averageRating: 0, // OMDB API doesn't provide ratings in search results
                watchCount: 0, // Default watch count
              }));
              this.isLoading2 = false;
              console.log(response);
            }
          },
          (error) => {
            console.error('Error fetching trending media:', error);
            this.isLoading2 = false;
          }
        );
      }
    });
  }

  loadMovieOfTheDay(): void {
    this.isLoading3 = true;
    this.errorLoading = false;

    // Generate a seed based on the current date to ensure the same movie is shown all day
    // but changes each day
    const dateSeed = `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate()}`;
    
    this.mediaService.getMovieOfTheDay(dateSeed).subscribe({
      next: (movie) => {
        this.movieOfTheDay = movie;
        this.isLoading3 = false;
      },
      error: (error) => {
        console.error('Error loading movie of the day:', error);
        this.isLoading3 = false;
        this.errorLoading = true;
        this.notificationService.showError('Failed to load movie of the day');
      }
    });
  }

  onMovieClick(): void {
    if (this.movieOfTheDay) {
      this.router.navigate(['/movies', this.movieOfTheDay.id]);
    }
  }

  // addToWatchlist(): void {
  //   if (this.movieOfTheDay) {
  //     this.mediaService.addToWatchlist(this.movieOfTheDay.id).subscribe({
  //       next: () => {
  //         this.notificationService.showSuccess('Added to your watchlist');
  //       },
  //       error: (error) => {
  //         console.error('Error adding to watchlist:', error);
  //         this.notificationService.showError('Failed to add to watchlist');
  //       }
  //     });
  //   }
  // }

  // likeMovie(): void {
  //   if (this.movieOfTheDay) {
  //     this.mediaService.likeMedia(this.movieOfTheDay.id).subscribe({
  //       next: () => {
  //         this.notificationService.showSuccess('Added to your favorites');
  //       },
  //       error: (error) => {
  //         console.error('Error adding to favorites:', error);
  //         this.notificationService.showError('Failed to add to favorites');
  //       }
  //     });
  //   }
  // }

  // Get a truncated version of the overview for display
  get truncatedOverview(): string {
    if (!this.movieOfTheDay?.overview) return '';
    return this.movieOfTheDay.overview.length > 200 
      ? `${this.movieOfTheDay.overview.substring(0, 200)}...` 
      : this.movieOfTheDay.overview;
  }

  // Get the release year for display
  get releaseYear(): string {
    if (!this.movieOfTheDay?.releaseDate) return '';
    return new Date(this.movieOfTheDay.releaseDate).getFullYear().toString();
  }

  // Format the genre list for display
  get genresList(): string {
    if (!this.movieOfTheDay?.genres || this.movieOfTheDay.genres.length === 0) return '';
    return this.movieOfTheDay.genres.map(genre => genre.name).join(', ');
  }

  // Format the runtime for display
  get formattedRuntime(): string {
    if (!this.movieOfTheDay?.runtime) return '';
    const hours = Math.floor(this.movieOfTheDay.runtime / 60);
    const minutes = this.movieOfTheDay.runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  retryLoading(): void {
    this.loadMovieOfTheDay();
  }
}


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

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser$: Observable<User | null>;
  trendingMedia: Media[] = [];
  reccomendedMedia: Media[] = [];
  isLoading = true;
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
    // this.mediaService.addToWatchlist(media.id).subscribe(
    //   () => console.log('Added to watchlist:', media.title),
    //   (error) => console.error('Error adding to watchlist', error)
    // );
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
    });
    
    
  }
}


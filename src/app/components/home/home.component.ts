import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MediaService } from '../../services/media.service';
import { Media } from '../../models/media.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentUser$: Observable<User | null>;
  trendingMedia: Media[] = [];
  reccomendedMedia: Media[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private mediaService: MediaService,
    private userService: UserService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.fetchTrendingMedia();
    this.fetchReccomendedMedia();
  }

  ngAfterViewInit(): void {
    // this.fetchTrendingMedia();
    // this.fetchReccomendedMedia();
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


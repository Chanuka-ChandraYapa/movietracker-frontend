import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Media } from '../../models/media.model';
import { MediaService } from '../../services/media.service';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: false
})
export class SearchResultsComponent implements OnInit {

  searchQuery: string = '';
  searchResults: Media[] = [];
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParams.pipe(
      switchMap(params => {
        this.searchQuery = params['q'] || '';
        if (!this.searchQuery.trim()) {
          this.isLoading = false;
          return of([]);
        }

        return this.mediaService.searchMedia(this.searchQuery);
      })
    ).subscribe({
      next: (content: Media[]) => {
        if (content.length === 0) {
        this.isLoading = true;
        this.mediaService.getMoviesByOMDB(this.searchQuery).subscribe(
          (response: any) => {
            console.log("Omdb called");
            this.mediaService.postMediaList(response).subscribe(
              (response: any) => {

                this.searchResults = response.map((item: any) => ({
                  ...item,
                  mediaType: item.numberOfSeasons > 0 ? 'tv' : 'movie'
              }));
          
                this.isLoading = false;
                console.log('Search results:', this.searchResults);

                        // If only one result, navigate directly to its detail page
                if (this.searchResults.length === 1) {
                  const media = this.searchResults[0];
                  this.router.navigate(['/movies', media.id]);
                }
              },
              (error) => {
                this.isLoading = false;
                this.hasError = true;
                this.errorMessage = 'Failed to load search results. Please try again.';
                console.error('Search error:', error);
              }
            );
          }
        )
        }
        else{
          // this.searchResults = content;
          this.searchResults = content.map((item: any) => ({
            ...item,
            mediaType: item.numberOfSeasons > 0 ? 'tv' : 'movie'
        }));
          console.log('Search results:', this.searchResults);
          this.isLoading = false;
          
          // If only one result, navigate directly to its detail page
          if (this.searchResults.length === 1) {
            const media = this.searchResults[0];
            this.router.navigate(['/movies', media.id]);
          }
      }},
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Failed to load search results. Please try again.';
        console.error('Search error:', error);
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

  navigateToDetail(media: Media): void {
    this.router.navigate(['/movies', media.id]);
  }

  addToWatchlist(event: Event, mediaId: number): void {
    event.stopPropagation(); // Prevent card click navigation
    // Add logic to add to watchlist
    console.log('Added to watchlist:', mediaId);
  }

  toggleLike(event: Event, mediaId: number): void {
    event.stopPropagation(); // Prevent card click navigation
    // Add logic to toggle like
    console.log('Toggled like:', mediaId);
  }

  getFormattedYear(dateString: Date): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  }
}
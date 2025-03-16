import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MediaService } from '../../services/media.service';
import { Media } from '../../models/media.model';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css'],
  standalone: false
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  searchPrompt: string = '';
  lastSearchPrompt: string = '';
  searchResults: Media[] = [];
  isSearching: boolean = false;
  hasSearched: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  performSearch(): void {
    if (!this.searchPrompt.trim() || this.isSearching) {
      return;
    }

    this.isSearching = true;
    this.lastSearchPrompt = this.searchPrompt;
    
    this.mediaService.getMoviesByAdvancedSearch(this.searchPrompt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.hasSearched = true;
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Error searching for media:', error);
          this.searchResults = [];
          this.hasSearched = true;
          this.isSearching = false;
        }
      });
  }

  useExample(example: string): void {
    this.searchPrompt = example;
    this.performSearch();
  }

  onAddToWatchlist(media: Media): void {
    // Pass the event up to the parent component or handle here
    console.log('Add to watchlist:', media);
  }

  onLikeMedia(media: Media): void {
    // Pass the event up to the parent component or handle here
    console.log('Like media:', media);
  }

  onMediaClick(media: Media): void {
    // Navigate to media details page or handle here
    console.log('Media clicked:', media);
  }
}
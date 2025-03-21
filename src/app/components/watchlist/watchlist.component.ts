import { Component, OnDestroy, OnInit } from '@angular/core';
import { WatchlistService } from '../../services/watchlist.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { finalize, switchMap, tap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { User, WatchedItem } from '../../models/user.model';
import { Media } from '../../models/media.model';
import { UserService } from '../../services/user.service';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
  standalone: false
})
export class WatchlistComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  currentUser: User | undefined;
  watchlistItems: WatchedItem[] = [];
  filteredWatchlistItems: WatchedItem[] = [];
  isLoading = true;
  activeFilter = 'all';
  sortOption = 'added-date-desc';
  viewMode = 'list';
  private destroy$ = new Subject<void>();
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  // Edit modal
  showEditModal = false;
  selectedItem: WatchedItem | null = null;
  editForm = {
    status: '',
    rating: 0,
    watchedDate: '',
    rewatch: false,
    rewatchCount: 0
  };

  constructor(
    private watchlistService: WatchlistService,
    private authService: AuthService,
    private userService: UserService,
    private mediaService: MediaService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.currentUser$.pipe(
      takeUntil(this.destroy$),
      tap(user => {
        if (user) {
          this.currentUser = user;
          this.loadWatchlist();
        } else {
          this.router.navigate(['/login']);
        }
      })
    ).subscribe(result => {
      if (result) {
        this.isLoading = false;
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWatchlist(): void {
    this.isLoading = true;
    this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        return this.userService.getUserWatchlist(user.id);
      })
    ).subscribe(
      (items: WatchedItem[]) => {
        this.watchlistItems = items;
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error => {
        console.error('Error loading watchlist:', error);
      }
    );
  }

  applyFiltersAndSort(): void {
    // Apply filters
    if (this.activeFilter === 'all') {
      this.filteredWatchlistItems = [...this.watchlistItems];
    } else {
      this.filteredWatchlistItems = this.watchlistItems.filter(item => item.status === this.activeFilter);
    }

    // Apply sorting
    switch (this.sortOption) {
      case 'added-date-desc':
        this.filteredWatchlistItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'added-date-asc':
        this.filteredWatchlistItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'rating-desc':
        this.filteredWatchlistItems.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        this.filteredWatchlistItems.sort((a, b) => a.rating - b.rating);
        break;
      case 'watched-date-desc':
        this.filteredWatchlistItems.sort((a, b) => {
          if (!a.watchedDate) return 1;
          if (!b.watchedDate) return -1;
          return new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime();
        });
        break;
      case 'title-asc':
        this.filteredWatchlistItems.sort((a, b) => a.media.title.localeCompare(b.media.title));
        break;
    }

    // Update pagination
    this.totalPages = Math.ceil(this.filteredWatchlistItems.length / this.itemsPerPage);
    this.currentPage = 1;
    
    // Update main list
    this.watchlistItems = this.filteredWatchlistItems;
  }

  filterWatchlist(filterType: string): void {
    this.activeFilter = filterType;
    this.applyFiltersAndSort();
  }

  sortWatchlist(): void {
    this.applyFiltersAndSort();
  }

  changeViewMode(mode: string): void {
    this.viewMode = mode;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  onAddToWatchlist(media: Media): void {
    // Check if already in watchlist
    if (!this.currentUser) {
      return;
    }
    
    this.mediaService.isInWatchlist(this.currentUser.id, media.id).subscribe(
      isInWatchlist => {
        if (isInWatchlist) {
          // Already in watchlist, show message or open edit modal
          const existingItem = this.watchlistItems.find(item => item.media.id === media.id);
          if (existingItem) {
            this.openEditModal(existingItem);
          }
        } else {
          if (!this.currentUser) {
            return;
          }

          // Add to watchlist with default status
          const details = {
            status: 'plan-to-watch',
            rating: 0,
            watchedDate: null,
            rewatch: false,
            rewatchCount: 0
          };
          
          this.watchlistService.addToWatchlistWithDetails(this.currentUser.id, media.id, details)
            .pipe(
              tap(() => {
                // Refresh watchlist
                this.loadWatchlist();
              })
            ).subscribe();
        }
      }
    );
  }

  removeFromWatchlist(item: WatchedItem): void {
    if (!this.currentUser) {
      return;
    }

    if (confirm('Are you sure you want to remove this item from your watchlist?')) {
      this.watchlistService.removeFromWatchlist(this.currentUser.id, item.media.id)
        .pipe(
          tap(() => {
            // Remove from local array
            this.watchlistItems = this.watchlistItems.filter(i => 
              !(i.media.id === item.media.id && i.user.id === item.user.id)
            );
            this.applyFiltersAndSort();
          })
        ).subscribe();
    }
  }

  onMediaClick(media: Media): void {
    this.router.navigate(['/movies', media.id]);
  }

  onLikeMedia(media: Media): void {
    // Implement like functionality
    // This would typically call a service to like/unlike the media
    console.log('Like media:', media);
  }

  updateRating(item: WatchedItem, rating: number): void {

    if (!this.currentUser) {
      return;
    }

    const updatedItem = { ...item, rating };
    
    // Update in backend
    const details = {
      status: updatedItem.status,
      rating: updatedItem.rating,
      watchedDate: updatedItem.watchedDate,
      rewatch: updatedItem.rewatch,
      rewatchCount: updatedItem.rewatchCount
    };
    
    this.watchlistService.addToWatchlistWithDetails(this.currentUser.id, item.media.id, details)
      .pipe(
        tap(() => {
          // Update in local array
          const index = this.watchlistItems.findIndex(i => 
            i.media.id === item.media.id && i.user.id === item.user.id
          );
          if (index !== -1) {
            this.watchlistItems[index] = { ...this.watchlistItems[index], rating };
          }
        })
      ).subscribe();
  }

  openEditModal(item: WatchedItem): void {
    this.selectedItem = item;
    this.editForm = {
      status: item.status,
      rating: item.rating,
      watchedDate: item.watchedDate,
      rewatch: item.rewatch,
      rewatchCount: item.rewatchCount
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedItem = null;
  }

  saveWatchlistItem(): void {
    if (!this.selectedItem || !this.currentUser) return;

    const details = { ...this.editForm };
    
    // Handle date format if needed
    if (details.watchedDate && typeof details.watchedDate === 'string') {
      const date = new Date(details.watchedDate);
      if (!isNaN(date.getTime())) {
        details.watchedDate = date.toISOString().split('T')[0];
      }
    }

    this.watchlistService.addToWatchlistWithDetails(this.currentUser.id, this.selectedItem.media.id, details)
      .pipe(
        tap(() => {
          // Update in local array
          const index = this.watchlistItems.findIndex(i => 
            i.media.id === this.selectedItem!.media.id && i.user.id === this.selectedItem!.user.id
          );
          
          if (index !== -1) {
            this.watchlistItems[index] = {
              ...this.watchlistItems[index],
              status: details.status,
              rating: details.rating,
              watchedDate: details.watchedDate,
              rewatch: details.rewatch,
              rewatchCount: details.rewatchCount
            };
          }
          
          this.closeEditModal();
          this.applyFiltersAndSort(); // Refresh the sorting/filtering
        })
      ).subscribe(
        () => {
          // Success handling
        },
        error => {
          console.error('Error updating watchlist item:', error);
          // Show error message to user
        }
      );
  }

  // Pipe to safely get media items to pass to the movie-card component
  get mediaItems(): Media[] {
    return this.watchlistItems.map(item => item.media);
  }
}
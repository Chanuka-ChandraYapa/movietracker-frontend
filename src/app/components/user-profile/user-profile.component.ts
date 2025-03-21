import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, combineLatest, of, take } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { User, UserStats, CustomList, WatchedItem } from '../../models/user.model';
import { Media, Review } from '../../models/media.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MediaService } from '../../services/media.service';
import { ReviewService } from '../../services/review.service';
import { WatchlistService } from '../../services/watchlist.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: false
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  profileUser$: Observable<User | null> | undefined;

  
  userStats: UserStats | undefined;
  watchedItems: WatchedItem[] = [];
  filteredWatchedItems: Media[] = [];
  userReviews: Review[] = [];
  customLists: CustomList[] = [];
  recentlyWatched: WatchedItem[] = [];
  highestRated: Media[] = [];
  following: User[] = [];
  followers: User[] = [];
  followingReviews: Review[] = [];
  
  // UI State
  activeTab = 'overview';
  networkTab = 'following';
  isLoading = true;
  isFollowing = false;
  
  // Filters and sorting
  watchedFilter = 'all';
  watchedSort = 'recent';
  reviewsSort = 'recent';
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private mediaService: MediaService,
    private reviewService: ReviewService,
    private watchService: WatchlistService,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }
  
  ngOnInit(): void {
    this.profileUser$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.userService.getUser(id)),
      tap(user => {
        this.loadUserData(user.id);
        this.checkIfFollowing(user.id);
      }),
      catchError(error => {
        console.error('Error loading user profile:', error);
        this.router.navigate(['/not-found']);
        return of(null);
      })
    );
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadUserData(userId: number): void {
    this.isLoading = true;
    
    combineLatest([
      this.userService.getUserStats(userId),
      this.userService.getUserWatchlist(userId),
      this.userService.getUserReviews(userId),
      this.userService.getUserLists(userId),
      this.userService.getUserRecentlyWatched(userId),
      this.userService.getUserHighestRated(userId),
      this.userService.getUserFollowing(userId),
      this.userService.getUserFollowers(userId),
      this.userService.getUserFollowingReviews(userId)
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ([
        stats, 
        watchlist, 
        reviews, 
        lists, 
        recentWatched, 
        highestRated,
        following,
        followers,
        followingReviews
      ]) => {
        this.userStats = stats;
        this.watchedItems = watchlist;
        this.userReviews = reviews;
        this.customLists = lists;
        this.recentlyWatched = recentWatched;
        this.highestRated = highestRated;
        this.following = following;
        this.followers = followers;
        this.followingReviews = followingReviews;
        
        this.filterWatchedItems();
        this.sortReviews();
        this.isLoading = false;
        console.log("lists", lists);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoading = false;
      }
    });
  }
  
  private checkIfFollowing(userId: number): void {
    this.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(currentUser => {
      if (currentUser) {
        this.isFollowing = currentUser.following.some(user => user.id === userId);
      }
    });
  }
  
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }
  
  setNetworkTab(tabName: string): void {
    this.networkTab = tabName;
  }
  
  toggleFollow(userId: number): void {
    this.currentUser$.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          this.router.navigate(['/login']);
          return of(null);
        }
        
        if (this.isFollowing) {
          return this.userService.unfollowUser(currentUser.id, userId).pipe(
            tap(() => {
              this.isFollowing = false;
            })
          );
        } else {
          return this.userService.followUser(currentUser.id, userId).pipe(
            tap(() => {
              this.isFollowing = true;
            })
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  isUserFollowing(userId: number): boolean {
    return this.following.some(user => user.id === userId);
  }
  
  toggleFollowUser(userId: number): void {
    this.currentUser$.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          this.router.navigate(['/login']);
          return of(null);
        }
        
        const isFollowing = this.isUserFollowing(userId);
        
        if (isFollowing) {
          return this.userService.unfollowUser(currentUser.id, userId).pipe(
            tap(() => {
              this.following = this.following.filter(user => user.id !== userId);
            })
          );
        } else {
          return this.userService.followUser(currentUser.id, userId).pipe(
            switchMap(() => this.userService.getUser(userId)),
            tap(user => {
              this.following.push(user);
            })
          );
        }
      }),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  unfollowUser(userId: number): void {
    this.currentUser$.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          return of(null);
        }
        
        return this.userService.unfollowUser(currentUser.id, userId).pipe(
          tap(() => {
            this.following = this.following.filter(user => user.id !== userId);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  filterWatchedItems(): void {
    if (!this.watchedItems) {
      this.filteredWatchedItems = [];
      return;
    }
    
    let filtered = this.watchedItems.map(item => ({
      ...item.media,
       mediaType: ((item.media.numberOfSeasons ?? 0) > 0 ? 'tv' : 'movie') as 'tv' | 'movie'
      }));
    
    if (this.watchedFilter === 'movies') {
      filtered = filtered.filter(media => media.mediaType === 'movie');
    } else if (this.watchedFilter === 'tv') {
      filtered = filtered.filter(media => media.mediaType === 'tv');
    }
    
    this.sortWatchedItems(filtered);
  }
  
  sortWatchedItems(items: Media[] | null = null): void {
    let mediaToSort = items || this.filteredWatchedItems;
    
    switch (this.watchedSort) {
      case 'recent':
        mediaToSort.sort((a, b) => {
          const aDate = this.getWatchedDate(a.id);
          const bDate = this.getWatchedDate(b.id);
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
        break;
      case 'rating-high':
        mediaToSort.sort((a, b) => {
          const aRating = this.getMediaRating(a.id);
          const bRating = this.getMediaRating(b.id);
          return bRating - aRating;
        });
        break;
      case 'rating-low':
        mediaToSort.sort((a, b) => {
          const aRating = this.getMediaRating(a.id);
          const bRating = this.getMediaRating(b.id);
          return aRating - bRating;
        });
        break;
      case 'title':
        mediaToSort.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    this.filteredWatchedItems = mediaToSort;
  }
  
  private getWatchedDate(mediaId: number): string {
    const watchedItem = this.watchedItems.find(item => item.media.id === mediaId);
    return watchedItem ? watchedItem.watchedDate : '';
  }
  
  private getMediaRating(mediaId: number): number {
    const watchedItem = this.watchedItems.find(item => item.media.id === mediaId);
    return watchedItem ? watchedItem.rating : 0;
  }
  
  sortReviews(): void {
    if (!this.userReviews) {
      return;
    }
    
    switch (this.reviewsSort) {
      case 'recent':
        this.userReviews.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'rating-high':
        // this.userReviews.sort((a, b) => b.rating - a.rating);
        this.userReviews.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'rating-low':
        // this.userReviews.sort((a, b) => a.rating - b.rating);
        this.userReviews.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }
  
  getStarsArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const starsArray = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsArray.push(1); // Full star
      } else if (i === fullStars && hasHalfStar) {
        starsArray.push(0.5); // Half star
      } else {
        starsArray.push(0); // Empty star
      }
    }
    
    return starsArray;
  }
  
  toggleLikeReview(review: Review): void {
    this.currentUser$.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          this.router.navigate(['/login']);
          return of(null);
        }
        
        if (review.likes > 0) {
          return this.reviewService.unlikeReview(review.id, currentUser.id).pipe(
            tap(() => {
              review.isLiked = false;
              review.likesCount? review.likesCount -= 1 : 0;
            })
          );
        } else {
          return this.reviewService.likeReview(review.id).pipe(
            tap(() => {
              review.isLiked = true;
              review.likesCount = (review.likesCount || 0) + 1;
            })
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  navigateToReview(review: Review): void {
    this.router.navigate(['/media', review.media.id, 'reviews', review.id]);
  }
  
  onMediaClick(media: Media): void {
    this.router.navigate(['/movies', media.id]);
  }
  
  onAddToWatchlist(media: Media): void {
    this.currentUser$.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          this.router.navigate(['/login']);
          return of(null);
        }
        
        // Assuming you have a MediaService with an addToWatchlist method
        return this.watchService.addToWatchlist(currentUser.id, media.id).pipe(
          tap(() => {
            // You might want to update the user's watchlist
            this.userService.getUserWatchlist(currentUser.id).pipe(
              take(1)
            ).subscribe(watchlist => {
              this.watchedItems = watchlist;
              this.filterWatchedItems();
            });
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  onLikeMedia(media: Media): void {
    this.currentUser$.pipe(
      take(1),
      switchMap(currentUser => {
        if (!currentUser) {
          this.router.navigate(['/login']);
          return of(null);
        }
        
        // Assuming you have a MediaService with a likeMedia method
        return this.mediaService.likeMedia(currentUser.id, media.id);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  createNewList(): void {
    this.router.navigate(['/lists/new']);
  }
}


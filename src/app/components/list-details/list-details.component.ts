import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomList } from '../../models/user.model';
import { Media } from '../../models/media.model';
import { ListService } from '../../services/list.service';
import { MediaService } from '../../services/media.service';
import { UserService } from '../../services/user.service';
import { WatchlistService } from '../../services/watchlist.service';
import { NotificationService } from '../../services/notification.service';
// import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.css'],
  standalone: false
})
export class ListDetailsComponent implements OnInit {
  customList: CustomList | null = null;
  isLoading = true;
  headerStyle: any = {};
  relatedLists: CustomList[] = [];
  userLists: CustomList[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService,
    private mediaService: MediaService,
    private userService: UserService,
    private watchService: WatchlistService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadListDetails();
  }

  loadListDetails(): void {
    const listId = this.route.snapshot.paramMap.get('id');
    
    if (!listId) {
      this.notificationService.showError('List ID is missing');
      this.router.navigate(['/lists']);
      return;
    }

    this.isLoading = true;
    
    this.listService.getList(Number(listId)).subscribe({
      next: (list) => {
        this.customList = list;
        this.isLoading = false;
        this.setHeaderBackground();
        if(this.customList?.user.id){
          this.loadUserLists(this.customList?.user.id);}
        this.notificationService.showSuccess('List details loaded successfully');
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load list details');
        console.error('Error loading list details:', error);
      }
    });
  }

  setHeaderBackground(): void {
    if (this.customList && this.customList.items.length > 0) {
      // Find the first item with a backdrop URL
      const itemWithBackdrop = this.customList.items.find(item => item.backdropUrl);
      
      if (itemWithBackdrop && itemWithBackdrop.backdropUrl) {
        this.headerStyle = {
          'background-image': `url(${itemWithBackdrop.backdropUrl})`
        };
      } else if (this.customList.items[0].posterUrl) {
        // Fallback to the first item's poster URL
        this.headerStyle = {
          'background-image': `url(${this.customList.items[0].posterUrl})`
        };
      }
    }
  }

  navigateToList(id: number): void {
    this.router.navigate(['/lists', id]);
  }

  loadUserLists(userId: number): void {
    this.isLoading = true;
    
    this.userService.getUserLists(userId)
      .subscribe({
        next: (response) => {
          this.userLists = response;
            this.userLists = this.userLists.filter(list => list.id !== this.customList?.id);
            // this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user lists:', error);
          // this.isLoading = false;
        }
      });
  }

  onAddToWatchlist(media: Media): void {
    // this.watchService.addToWatchlist(media.id).subscribe({
    //   next: () => {
    //     // this.notificationService.showSuccess('Added to watchlist');
    //   },
    //   error: (error) => {
    //     // this.notificationService.showError('Failed to add to watchlist');
    //     console.error('Error adding to watchlist:', error);
    //   }
    // });
  }

  onLikeMedia(media: Media): void {
    // this.mediaService.likeMedia(media.id).subscribe({
    //   next: () => {
    //     this.notificationService.showSuccess('Added to favorites');
    //   },
    //   error: (error) => {
    //     this.notificationService.showError('Failed to add to favorites');
    //     console.error('Error adding to favorites:', error);
    //   }
    // });
  }

  onMediaClick(media: Media): void {
    const route = media.mediaType === 'movie' ? '/movies' : '/movies';
    this.router.navigate([route, media.id]);
  }
}
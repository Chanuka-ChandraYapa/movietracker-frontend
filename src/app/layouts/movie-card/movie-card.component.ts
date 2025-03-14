import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';import { Media } from '../../models/media.model';

// export interface Media {
//   id: number;
//   title: string;
//   posterUrl: string;
//   releaseDate: string;
//   averageRating?: number;
//   mediaType?: 'movie' | 'tv';
// }

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
  standalone: false
})
export class MovieCardComponent implements AfterViewInit {
  @Input() mediaItems: Media[] = [];
  @Input() isLoading: boolean = false;
  @Input() displayType: 'grid' | 'slider' = 'slider';
  @Input() baseRoute: string = '/movies';
  @Input() cardsToSlide: number = 2;

  @Output() addToWatchlist = new EventEmitter<Media>();
  @Output() likeMedia = new EventEmitter<Media>();
  @Output() mediaClick = new EventEmitter<Media>();

  @ViewChild('sliderContainer') sliderContainer!: ElementRef;

  public showLeftArrow: boolean = false;
  public showRightArrow: boolean = true;
  public cardWidth: number = 180; // Default width, will be calculated based on actual rendering

  ngAfterViewInit() {
    // Calculate card width after view is initialized
    setTimeout(() => {
      const container = this.sliderContainer.nativeElement;
      if (container && container.children.length > 1) {
        const firstCard = container.children[0];
        // Get actual width including margins
        const computedStyle = window.getComputedStyle(firstCard);
        const marginLeft = parseFloat(computedStyle.marginLeft);
        const marginRight = parseFloat(computedStyle.marginRight);
        this.cardWidth = firstCard.offsetWidth + marginLeft + marginRight;
        
        // Check if right arrow should be visible
        this.updateArrowVisibility();
      }
    });
  }

  onAddToWatchlist(event: Event, media: Media): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToWatchlist.emit(media);
  }

  onLikeMedia(event: Event, media: Media): void {
    event.preventDefault();
    event.stopPropagation();
    this.likeMedia.emit(media);
  }

  onMediaClick(media: Media): void {
    this.mediaClick.emit(media);
  }

  slideLeft(): void {
    const container = this.sliderContainer.nativeElement;
    const scrollAmount = this.cardWidth * this.cardsToSlide;
    
    // Smooth scroll to the left
    const targetScrollLeft = container.scrollLeft - scrollAmount;
    this.smoothScroll(container, targetScrollLeft, 300);
    
    // Update arrow visibility after scrolling
    setTimeout(() => this.updateArrowVisibility(), 350);
  }

  slideRight(): void {
    const container = this.sliderContainer.nativeElement;
    const scrollAmount = this.cardWidth * this.cardsToSlide;
    
    // Smooth scroll to the right
    const targetScrollLeft = container.scrollLeft + scrollAmount;
    this.smoothScroll(container, targetScrollLeft, 300);
    
    // Update arrow visibility after scrolling
    setTimeout(() => this.updateArrowVisibility(), 350);
  }

  private smoothScroll(element: HTMLElement, target: number, duration: number): void {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();
    
    function animateScroll(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime < duration) {
        element.scrollLeft = easeInOutQuad(elapsedTime, start, change, duration);
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollLeft = target;
      }
    }
    
    // Easing function for smooth animation
    function easeInOutQuad(t: number, b: number, c: number, d: number): number {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animateScroll);
  }

  private updateArrowVisibility(): void {
    const container = this.sliderContainer.nativeElement;
    
    // Show left arrow if we're not at the beginning
    this.showLeftArrow = container.scrollLeft > 0;
    
    // Show right arrow if we're not at the end
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    this.showRightArrow = container.scrollLeft < maxScrollLeft - 10; // Small buffer for rounding errors
  }
}
import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';import { Media } from '../../models/media.model';

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
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private momentumID: any;
  private velX = 0;
  private momentum = 0.99; // friction

  ngAfterViewInit() {
    // Calculate card width after view is initialized
    this.setupSlider();
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

  private setupSlider() {
    const slider = this.sliderContainer.nativeElement;
    
    // Prevent default touch behavior like pull-to-refresh
    slider.addEventListener('touchstart', (e: { touches: string | any[]; }) => {
      if (e.touches.length === 1) {
        slider.style.touchAction = 'pan-y';
      }
    });

    slider.addEventListener('touchmove', (e: { touches: string | any[]; }) => {
      if (e.touches.length === 1) {
        slider.style.touchAction = 'pan-x';
      }
    });

    slider.addEventListener('touchend', () => {
      slider.style.touchAction = '';
    });
  }

  // Mouse wheel horizontal scrolling
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.displayType === 'slider' && !this.isLoading) {
      event.preventDefault();
      const slider = this.sliderContainer.nativeElement;
      slider.scrollLeft += event.deltaY * 2; // Adjust multiplier for sensitivity
    }
  }

  // Touch events for mobile
  onTouchStart(e: TouchEvent) {
    if (this.displayType !== 'slider' || this.isLoading) return;
    
    const slider = this.sliderContainer.nativeElement;
    this.isDragging = true;
    this.startX = e.touches[0].pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
    this.velX = 0;
    cancelAnimationFrame(this.momentumID);
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    
    const slider = this.sliderContainer.nativeElement;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - this.startX) * 9; // Adjust multiplier for sensitivity
    slider.scrollLeft = this.scrollLeft - walk;
    this.velX = walk;
  }

  onTouchEnd() {
    this.isDragging = false;
    this.startMomentumTracking();
  }

  // Mouse drag events for desktop
  // onMouseDown(e: MouseEvent) {
  //   if (this.displayType !== 'slider' || this.isLoading) return;
    
  //   const slider = this.sliderContainer.nativeElement;
  //   this.isDragging = true;
  //   this.startX = e.pageX - slider.offsetLeft;
  //   this.scrollLeft = slider.scrollLeft;
  //   this.velX = 0;
  //   cancelAnimationFrame(this.momentumID);
  //   slider.style.cursor = 'grabbing';
  //   slider.style.userSelect = 'none';
  // }

  // onMouseMove(e: MouseEvent) {
  //   if (!this.isDragging) return;
  //   e.preventDefault();
    
  //   const slider = this.sliderContainer.nativeElement;
  //   const x = e.pageX - slider.offsetLeft;
  //   const walk = (x - this.startX) * 2; // Adjust multiplier for sensitivity
  //   slider.scrollLeft = this.scrollLeft - walk;
  //   this.velX = walk;
  // }

  // onMouseUp() {
  //   const slider = this.sliderContainer.nativeElement;
  //   this.isDragging = false;
  //   slider.style.cursor = 'grab';
  //   slider.style.userSelect = '';
  //   this.startMomentumTracking();
  // }

  // onMouseLeave() {
  //   if (this.isDragging) {
  //     this.onMouseUp();
  //   }
  // }

  // Momentum scrolling for smooth stop
  private startMomentumTracking() {
    cancelAnimationFrame(this.momentumID);
    this.momentumID = requestAnimationFrame(this.momentumLoop.bind(this));
  }

  private momentumLoop() {
    const slider = this.sliderContainer.nativeElement;
    
    this.velX *= this.momentum;
    slider.scrollLeft += this.velX;
    
    if (Math.abs(this.velX) > 0.5) {
      this.momentumID = requestAnimationFrame(this.momentumLoop.bind(this));
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MediaService } from '../../services/media.service';

interface SearchType {
  label: string;
  value: string;
}

interface GenreOption {
  id: number;
  name: string;
  selected: boolean;
}

interface RecentSearch {
  id: string;
  query: string;
  type: string;
  timestamp: number;
}

interface SearchFilters {
  yearFrom: number | null;
  yearTo: number | null;
  minRating: number;
  sortBy: string;
  sortDirection: string;
  contentRating: string;
  knownFor: string;
}

@Component({
  selector: 'app-media-search',
  templateUrl: './media-search.component.html',
  styleUrls: ['./media-search.component.css'],
  standalone: false
})
export class MediaSearchComponent implements OnInit {
  // Search state
  searchQuery: string = '';
  selectedType: string = 'movie';
  showFilters: boolean = false;
  isLoading: boolean = false;
  searchMode: string = "normal";
  
  // Search input debounce
  private searchSubject = new Subject<string>();
  
  // Search types
  searchTypes: SearchType[] = [
    { label: 'Movies', value: 'movie' },
    { label: 'TV Shows', value: 'tv' },
    { label: 'People', value: 'person' },
    { label: 'All', value: 'all' }
  ];
  
  // Genres (to be populated from API)
  genres: GenreOption[] = [];
  
  // Recent searches
  recentSearches: RecentSearch[] = [];
  
  // Filters
  filters: SearchFilters = {
    yearFrom: null,
    yearTo: null,
    minRating: 0,
    sortBy: 'relevance',
    sortDirection: 'desc',
    contentRating: 'Any',
    knownFor: 'Any'
  };
  
  constructor(private mediaService: MediaService) { }
  
  ngOnInit(): void {
    // Initialize search debounce
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length > 2) {
        this.performSearch();
      }
    });
    
    // Load genres based on selected type
    this.loadGenres();
    
    // Load recent searches from local storage
    this.loadRecentSearches();
  }
  
  loadGenres(): void {
    this.isLoading = true;
    
    if (this.selectedType === 'movie') {
      this.mediaService.getMovieGenres().subscribe(
        (genres) => {
          this.genres = genres.map(g => ({ ...g, selected: false }));
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading movie genres:', error);
          this.isLoading = false;
        }
      );
    } else if (this.selectedType === 'tv') {
      this.mediaService.getTvGenres().subscribe(
        (genres) => {
          this.genres = genres.map(g => ({ ...g, selected: false }));
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading TV genres:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.genres = [];
      this.isLoading = false;
    }
  }
  
  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleSearchMode(): void {
    this.searchMode = this.searchMode === "normal" ? "advanced" : "normal";
    console.log(this.searchMode);
  }
  
  setSearchType(type: string): void {
    this.selectedType = type;
    this.loadGenres();
    this.resetFilters();
  }
  
  performSearch(): void {
    if (!this.searchQuery || this.searchQuery.trim().length < 2) {
      return;
    }
    
    this.isLoading = true;
    
    // Collect selected genres
    const selectedGenres = this.genres
      .filter(g => g.selected)
      .map(g => g.id);
    
    // Prepare search parameters
    const searchParams = {
      query: this.searchQuery,
      type: this.selectedType,
      yearFrom: this.filters.yearFrom,
      yearTo: this.filters.yearTo,
      genres: selectedGenres,
      minRating: this.filters.minRating,
      sortBy: this.filters.sortBy,
      sortDirection: this.filters.sortDirection,
      contentRating: this.filters.contentRating,
      knownFor: this.filters.knownFor
    };
    
    // Call appropriate search method based on type
    if (this.selectedType === 'movie') {
      this.mediaService.searchMoviesWithParams(searchParams).subscribe(
        (results) => {
          this.handleSearchResults(results);
          this.addToRecentSearches(this.searchQuery, this.selectedType);
        },
        (error) => this.handleSearchError(error)
      );
    } else if (this.selectedType === 'tv') {
      this.mediaService.searchTvSeriesWithParams(searchParams).subscribe(
        (results) => {
          this.handleSearchResults(results);
          this.addToRecentSearches(this.searchQuery, this.selectedType);
        },
        (error) => this.handleSearchError(error)
      );
    } else if (this.selectedType === 'person') {
      this.mediaService.searchPeople(searchParams).subscribe(
        (results) => {
          this.handleSearchResults(results);
          this.addToRecentSearches(this.searchQuery, this.selectedType);
        },
        (error) => this.handleSearchError(error)
      );
    } else {
      // All types search
      this.mediaService.searchAll(searchParams).subscribe(
        (results) => {
          this.handleSearchResults(results);
          this.addToRecentSearches(this.searchQuery, this.selectedType);
        },
        (error) => this.handleSearchError(error)
      );
    }
  }
  
  handleSearchResults(results: any): void {
    this.isLoading = false;
    // Search results handling will be implemented by the parent component
    console.log('Search results:', results);
    // Emit search results to parent component
  }
  
  handleSearchError(error: any): void {
    this.isLoading = false;
    console.error('Search error:', error);
    // Error handling will be implemented
  }
  
  clearSearch(): void {
    this.searchQuery = '';
  }
  
  applyFilters(): void {
    this.performSearch();
  }
  
  resetFilters(): void {
    this.filters = {
      yearFrom: null,
      yearTo: null,
      minRating: 0,
      sortBy: 'relevance',
      sortDirection: 'desc',
      contentRating: 'Any',
      knownFor: 'Any'
    };
    
    // Reset genre selections
    this.genres.forEach(genre => genre.selected = false);
  }
  
  addToRecentSearches(query: string, type: string): void {
    // Don't add empty queries
    if (!query || query.trim().length === 0) {
      return;
    }
    
    // Check if the search already exists
    const existingSearchIndex = this.recentSearches.findIndex(
      search => search.query.toLowerCase() === query.toLowerCase() && search.type === type
    );
    
    // If it exists, remove it (we'll add it back at the top)
    if (existingSearchIndex !== -1) {
      this.recentSearches.splice(existingSearchIndex, 1);
    }
    
    // Add the search to the top of the list
    const newSearch: RecentSearch = {
      id: `${Date.now()}`,
      query: query,
      type: type,
      timestamp: Date.now()
    };
    
    this.recentSearches.unshift(newSearch);
    
    // Limit to 5 recent searches
    if (this.recentSearches.length > 5) {
      this.recentSearches.pop();
    }
    
    // Save to local storage
    this.saveRecentSearches();
  }
  
  loadRecentSearches(): void {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      this.recentSearches = JSON.parse(storedSearches);
    }
  }
  
  saveRecentSearches(): void {
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }
  
  useRecentSearch(search: RecentSearch): void {
    this.searchQuery = search.query;
    this.selectedType = search.type;
    this.performSearch();
  }
  
  removeRecentSearch(search: RecentSearch): void {
    const index = this.recentSearches.findIndex(s => s.id === search.id);
    if (index !== -1) {
      this.recentSearches.splice(index, 1);
      this.saveRecentSearches();
    }
  }
  
  getSearchTypeLabel(type: string): string {
    const searchType = this.searchTypes.find(t => t.value === type);
    return searchType ? searchType.label : 'All';
  }
}
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Media } from '../../models/media.model';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  standalone: false
})
export class MovieListComponent implements OnInit {
  movies: Media[] = [];

  constructor(private apiService: ApiService, private mediaService: MediaService) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.mediaService.getImdbtop10().subscribe(
      (response: any) => {
        if (response) {
          this.movies = response.map((item: any) => ({
            id: item.id,
            title: item.title,
            posterUrl: item.posterUrl,
            backdropUrl: '', // OMDB API doesn't provide backdrop URLs
            releaseDate: item.year,
            overview: item.overview, // OMDB API doesn't provide overviews in search results
            genres: [], // OMDB API doesn't provide genres in search results
            mediaType: 'movie',
            runtime: 0, // OMDB API doesn't provide runtime in search results
            status: 'Released', // Default status
            averageRating: 0, // OMDB API doesn't provide ratings in search results
            watchCount: 0, // Default watch count
          }));
          console.log(response);
        }
      },
      (error) => {
        console.error('Error fetching trending media:', error);
      }
    );
  }
}
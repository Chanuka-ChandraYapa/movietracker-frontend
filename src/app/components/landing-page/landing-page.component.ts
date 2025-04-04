import { Component, OnInit } from '@angular/core';

interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  poster: string;
  rating: number;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: false
})
export class LandingPageComponent implements OnInit {
  featuredMovies: Movie[] = [];
  trendingMovies: Movie[] = [];
  recentlyReviewed: Movie[] = [];
  isMenuOpen = false;

  constructor() { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    // In a real app, this would be a service call
    this.featuredMovies = [
      {
        id: 1,
        title: 'Dune: Part Two',
        year: 2024,
        director: 'Denis Villeneuve',
        poster: 'https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYjM0My00MTUwLWFlYTMtMWI2NGUzYjhkZWY5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
        rating: 4.5
      },
      {
        id: 2,
        title: 'Oppenheimer',
        year: 2023,
        director: 'Christopher Nolan',
        poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
        rating: 4.8
      },
      {
        id: 3,
        title: 'Poor Things',
        year: 2023,
        director: 'Yorgos Lanthimos',
        poster: 'https://m.media-amazon.com/images/M/MV5BNGIyYWMzNjctNDQxYS00YzIxLWFkYTQtZjU5ZjdkZjA3ZThlXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
        rating: 4.3
      }
    ];

    this.trendingMovies = [
      {
        id: 4,
        title: 'The Batman',
        year: 2022,
        director: 'Matt Reeves',
        poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
        rating: 4.0
      },
      {
        id: 5,
        title: 'Everything Everywhere All at Once',
        year: 2022,
        director: 'Daniel Kwan, Daniel Scheinert',
        poster: 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg',
        rating: 4.7
      },
      {
        id: 6,
        title: 'Killers of the Flower Moon',
        year: 2023,
        director: 'Martin Scorsese',
        poster: 'https://m.media-amazon.com/images/M/MV5BNjQwOGM2YTItMGYwNC00YTM4LWI0Y2QtZjQ2ZDcyMmRjMTFhXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
        rating: 4.2
      }
    ];

    this.recentlyReviewed = [
      {
        id: 7,
        title: 'Barbie',
        year: 2023,
        director: 'Greta Gerwig',
        poster: 'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
        rating: 3.9
      },
      {
        id: 8,
        title: 'Past Lives',
        year: 2023,
        director: 'Celine Song',
        poster: 'https://m.media-amazon.com/images/M/MV5BOTkzYmMxNTItZDAxNC00NGM0LWIyODMtMWYzMzRkMTlkNjA3XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_.jpg',
        rating: 4.6
      },
      {
        id: 9,
        title: 'The Zone of Interest',
        year: 2023,
        director: 'Jonathan Glazer',
        poster: 'https://m.media-amazon.com/images/M/MV5BNDkxYTFjN2EtZTMzYS00ZTQ4LWIzYzEtYzI1OWNlZThhYjUwXkEyXkFqcGdeQXVyMTMzNDE5NDM2._V1_.jpg',
        rating: 4.4
      }
    ];
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getRatingStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return [
      ...Array(fullStars).fill('full'),
      ...(halfStar ? ['half'] : []),
      ...Array(emptyStars).fill('empty')
    ];
  }
}
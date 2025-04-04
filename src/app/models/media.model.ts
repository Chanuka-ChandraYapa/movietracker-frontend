import { User, WatchedItem } from "./user.model";

// export interface Media {
//     id: number;
//     title: string;
//     originalTitle: string;
//     year: number;
//     overview: string;
//     posterUrl: string;
//     backdropUrl: string;
//     genres: Genre[];
//     watchedBy: WatchedItem[];
//     reviews: Review[];
//     createdAt: string;
//     updatedAt: string;
//     averageRating: number;
//   }

export interface Media {
  id: number;
  title: string;
  originalTitle: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseDate: Date;
  year: number;
  overview: string;
  genres: Genre[];
  mediaType: 'movie' | 'tv';
  runtime?: number; // For movies
  status: string;
  averageRating?: number;
  watchCount?: number;
  budget?: number;
  revenue?: number;
  tagline?: string;
  voteCount?: number;
  originalLanguage?: string;
  rated?: string;
  language?: string;
  country?: string;
  awards?: string;
  boxOffice?: string;
  production?: string;
  metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbId?: string;
  writer?: string;
  actors?: any[];
  ratings?: any[];
  watchedBy?: any[];
  reviews?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  creator?: string;
  firstAirDate?: Date;
  lastAirDate?: Date;
  inProduction?: boolean;
  seasons?: TvSeason[];
  director?: string;
}

export interface Movie extends Media {
  runtime: number;
  // releaseDate: string;
  // director: string;
}

export interface TvSeries extends Media {
  numberOfSeasons: number;
  numberOfEpisodes: number;
  creator: string;
  firstAirDate: Date;
  lastAirDate: Date;
  inProduction: boolean;
}
  
  export interface Genre {
    id: number;
    name: string;
    media: Media[];
  }

  export interface Tag {
    id?: number;
    name: string;
  }
  
  export interface Review {
    id: number;
    user: User;
    media: Media;
    content: string;
    containsSpoilers: boolean;
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
    likesCount?: number;
  }

  export interface TvEpisode {
    id: number;
    title: string;
    episodeNumber: number;
    overview?: string;
    runtime?: number;
    airDate?: string;
    stillUrl?: string;
    rated?: string;
    language?: string;
    country?: string;
    awards?: string;
    imdbRating?: string;
    imdbVotes?: string;
    imdbId?: string;
    genres?: Genre[];
    actors?: any[];
    ratings?: any[];
  }

  export interface TvSeason {
    id: number;
    seasonNumber: number;
    name?: string;
    overview?: string;
    posterUrl?: string;
    airDate?: string;
    episodeCount?: number;
    episodes?: TvEpisode[];
  }

  export const allPosterUrls = [
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMzk2OTg4MTk1NF5BMl5BanBnXkFtZTcwNjExNTgzNA@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNDc3Y2YwMjUtYzlkMi00MTljLTg1ZGMtYzUwODljZTI1OTZjXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMjAwODYzNDY4Ml5BMl5BanBnXkFtZTcwODkwNTgzNA@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYWUwNDk2ZDYtNmFkMi00NjE5LWE1M2ItYTRkNTFjZDU3ZDU4L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTYxNjkxOQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BN2Y2OWU4MWMtNmIyMy00YzMyLWI0Y2ItMTcyZDc3MTdmZDU4XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYjg4ZjUzMzMtYzlmYi00YTcwLTlkOWUtYWFmY2RhNjliODQzXkEyXkFqcGdeQXVyNTUyMzE4Mzg@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTM3NzA1MjM2N15BMl5BanBnXkFtZTcwMzY3MTMzNA@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTI3MzMwMzIxMF5BMl5BanBnXkFtZTYwNTM0Nzc5..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYTViNjMyNmUtNDFkNC00ZDRlLThmMDUtZDU2YWE4NGI2ZjVmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMGM1NzM2ZjktNDM5ZS00YmExLTk5ZmYtNDdkNjdkNTdhZWZkXkEyXkFqcGdeQXVyNjE5MjUyOTM@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYWZmNjkzOGItNmI4ZS00MDQ1LThhMzQtOTI3MThjOTI4Njg2XkEyXkFqcGdeQXVyMDUyOTUyNQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BZDZhNDRlZjAtYzdhNy00ZjU1LWFlMDYtNjA5NjliM2Y5ZmVjL2ltYWdlXkEyXkFqcGdeQXVyNjE5MjUyOTM@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTQyNzIyMjI1MV5BMl5BanBnXkFtZTgwMjkyMzUzMzE@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BZjk3YmZhMDAtOWUzMS00YjE5LTkxNzAtY2I1NGZjMDA2ZTk0XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTE5ODk5MDAwN15BMl5BanBnXkFtZTYwNDA3MjE5..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTgwNjkwOTQ5NV5BMl5BanBnXkFtZTcwNjc3ODAyMQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BOTgwMTExNjk2M15BMl5BanBnXkFtZTcwNzQxNTEzMQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTlmNzhiMWEtOWVjZC00NmM0LTgxNDItMDJmYTkxYTZkY2FjXkEyXkFqcGdeQXVyNTUyMzE4Mzg@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BODg4NzA0MTktOGU5ZS00ODlkLWE3ZmQtYjAzNjNmM2E3NmEzL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNGQxNDgzZWQtZTNjNi00M2RkLWExZmEtNmE1NjEyZDEwMzA5XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BZTUxMzY1N2YtZjM5NC00MmUzLThkNzEtYjNiYzg0MzI4MDc5L2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTM2NjExODYyOF5BMl5BanBnXkFtZTcwNTc0NjgyNA@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTFkZmQ5OWEtNjFmMC00ZTI2LWE0ZWUtN2VhOWE1MzdiOGJhXkEyXkFqcGdeQXVyMTQ4NDY5OTc@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMGE1ZTQ0ZTEtZTEwZS00NWE0LTlmMDUtMTE1ZWJiZTYzZTQ2XkEyXkFqcGdeQXVyNTAyODkwOQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNjEzYjJmNzgtNDkwNy00MTQ4LTlmMWMtNzA4YjE2NjI0ZDg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNWY3M2I0YzItNzA1ZS00MzE3LThlYTEtMTg2YjNiOTYzODQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BZjNkNGJjYWEtM2IyNi00ZjM5LWFlYjYtYjQ4NTU5MGFlMTI2XkEyXkFqcGdeQXVyMTMxMTY0OTQ@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMmFkY2IxNTAtMWRiNS00MWU2LWI1NDYtY2YxYTQyYTk5OTBhXkEyXkFqcGdeQXVyNDk3NzU2MTQ@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNThmZGJiYzctOTdhNS00ODhiLTg4NzctNDc1ZDRmOGU1MTJmXkEyXkFqcGdeQXVyNjQ2MjQ5NzM@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYjA0NDMyYTgtMDgxOC00NGE0LWJkOTQtNDRjMjEzZmU0ZTQ3XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYjEwZDUyODktOGVmOC00ZjIyLTlmM2YtZDZjY2Y2ZWE4ZjMyXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BZWY3OWY3MjUtN2E3NS00M2RkLWI5MWUtMmI4MjQ0MjFmZjM2XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNDE0NTQ1NjQzM15BMl5BanBnXkFtZTYwNDI4MDU5..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTk2NTE5MDI4MV5BMl5BanBnXkFtZTcwODM4MDMzMQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYWU1YjQ3NTUtZjZkZi00ZDc5LTgyZTgtNzkxMTIzNzUwZGY0XkEyXkFqcGdeQXVyNDk3NzU2MTQ@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMjQ2NTQ0NzgtODUzYy00NThlLWFhNDEtNjhkY2M0M2EwY2ZmXkEyXkFqcGdeQXVyNDk3NzU2MTQ@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMjEyNzgxNTk0OF5BMl5BanBnXkFtZTcwOTAzNjgyMQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMzcyMjZmNjctNGNhMS00ZmQxLWFkNzQtYTIxYjVkYmU1NmNmXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNzE1Njk0NmItNDhlMC00ZmFlLWI4ZTUtYTY4ZjgzNjkyMTU1XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BYzhkNjE2YTQtYWQzNS00ZTkwLTg4YzAtNjNlYTRlMGEzYjcxL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNzhkNjFlNDQtMDYxNy00NGU5LWE4YmItOWIyYzg5MTNmNzcxXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTg5NTQxMjc5MV5BMl5BanBnXkFtZTcwMjYxODcxMQ@@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMGIxN2NiMDYtYjQ0YS00M2ViLTkzYTUtNDdhYWZmOTM0ZmJkXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNTA5ZjdjNWUtZGUwNy00N2RhLWJiZmItYzFhYjU1NmYxNjY4XkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BNjQ1MDA0YWMtMDliZC00N2ZhLWIwZDItNjhjNTMzYTMwMWU4L2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BN2VkMzZlMTctZjVlOS00NmQ1LTg1ZDItMDc5NzhlNDRhMjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BZmJmMTM5YzItOTU2OS00ZGUwLWI3MzgtMmYwMWY2YmFlM2Q1XkEyXkFqcGdeQXVyNjg3MDM4Mzc@..jpg",
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTYwMjYxNTAyN15BMl5BanBnXkFtZTgwMTc3MjkyMTE@..jpg",
  ];
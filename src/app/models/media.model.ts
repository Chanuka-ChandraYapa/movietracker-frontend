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

}

export interface Movie extends Media {
  runtime: number;
  // releaseDate: string;
  director: string;
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
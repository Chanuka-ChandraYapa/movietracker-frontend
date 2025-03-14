import { Media, Review } from "./media.model";

export interface User {
    id: number;
    username: string;
    email: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
    watchedItems: WatchedItem[];
    reviews: Review[];
    customLists: CustomList[];
    following: User[];
    followers: User[];
  }

  export interface WatchedItem {
    id: number;
    user: User;
    media: Media;
    status: string;
    rating: number;
    watchedDate: string;
    rewatch: boolean;
    rewatchCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CustomList {
    id: number;
    user: User;
    name: string;
    description: string;
    isPublic: boolean;
    items: Media[];
    createdAt: string;
    updatedAt: string;
  }
  
  // src/app/core/models/user-stats.model.ts
  export interface UserStats {
    moviesWatched: number;
    tvSeriesWatched: number;
    totalReviews: number;
    averageRating: number;
    mostWatchedGenre: string;
  }
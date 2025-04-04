import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewDetailComponent } from './components/review-detail/review-detail.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { CustomListsComponent } from './components/custom-lists/custom-lists.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { MediaSearchComponent } from './components/media-search/media-search.component';
import { ListDetailsComponent } from './components/list-details/list-details.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DiscoverComponent } from './components/discover/discover.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'users/:id', component: UserProfileComponent },
  { path: 'reviews', component: ReviewListComponent },
  { path: 'reviews/:id', component: ReviewDetailComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'lists', component: CustomListsComponent },
  { path: 'lists/:id', component: ListDetailsComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent },
  { path: 'media-search', component: MediaSearchComponent },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'browse/films', component: DiscoverComponent },
  { path: '**', redirectTo: '' } // Redirect to home for unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
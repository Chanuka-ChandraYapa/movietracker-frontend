import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewDetailComponent } from './components/review-detail/review-detail.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { CustomListsComponent } from './components/custom-lists/custom-lists.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './layouts/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { MovieCardComponent } from './layouts/movie-card/movie-card.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { MediaSearchComponent } from './components/media-search/media-search.component';
import { ListDetailsComponent } from './components/list-details/list-details.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewModalComponent } from './layouts/review-modal/review-modal.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DiscoverComponent } from './components/discover/discover.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MovieListComponent,
    MovieDetailComponent,
    UserProfileComponent,
    ReviewListComponent,
    ReviewDetailComponent,
    WatchlistComponent,
    CustomListsComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    SearchResultsComponent,
    MovieCardComponent,
    AdvancedSearchComponent,
    MediaSearchComponent,
    ListDetailsComponent,
    ReviewModalComponent,
    LandingPageComponent,
    DiscoverComponent
  ],
  imports: [
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true, // Required for multiple interceptors
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

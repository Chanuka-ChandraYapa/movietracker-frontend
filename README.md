# Prometheon

Prometheon is a comprehensive media tracking platform built with Angular that helps users discover, track, rate, and review movies and TV shows. Keep your entertainment organized in one place with powerful tracking features, personalized recommendations, and a vibrant community of fellow film and television enthusiasts.

![CinemaTrace Screenshot](src/app/assets/images/explain.png)

## Features

### Media Tracking

- **Watchlist Management**: Add movies and TV shows to your watchlist with status tracking (Watched, Watching, Want to Watch)
- **Rating System**: Rate titles on a scale of 1-10 stars
- **Personal Reviews**: Write and share your thoughts on the media you consume
- **Custom Lists**: Create themed collections like "Best Sci-Fi Movies" or "Shows to Watch This Summer"

### Discovery

- **Advanced Search**: Find content by title, director, cast, genre, release year, and more
- **Tag System**: Browse content through user-generated tags for more specific categorization
- **Trending Media**: Discover what's popular in the community
- **Personalized Recommendations**: Get suggestions based on your watch history and preferences

### User Experience

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Choose your preferred color theme for comfortable browsing
- **User Profiles**: Customize your profile with bio, avatar, and statistics
- **Following System**: Follow other users to see their activity and recommendations

### Social Features

- **Activity Feed**: See recent ratings, reviews, and lists from users you follow
- **Comments**: Discuss movies and shows through comments on reviews
- **Share**: Easily share your ratings and reviews to other platforms

## Tech Stack

- **Frontend**: Angular 15+, TypeScript, RxJS
- **Styling**: CSS with custom variables for theming
- **Authentication**: JWT-based authentication
- **API Integration**: RESTful API consumption

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Angular CLI (latest)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Chanuka-ChandraYapa/movietracker-frontend.git
   cd movietracker-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Update the API URL and other configuration values

4. Start the development server:

   ```bash
   ng serve
   ```

5. Open your browser and navigate to `http://localhost:4200`

### Backend Integration

This project requires the Prometheon backend API to function properly. The backend repository is available at:
[github.com/Chanuka-ChandraYapa/movietracker](https://github.com/Chanuka-ChandraYapa/movietracker.git)

The backend is built with Spring Boot and provides all necessary API endpoints for:

- Media data and metadata
- User authentication and profiles
- Watchlist operations
- Ratings and reviews
- Tags and lists

Make sure to set up and run the backend server before using the frontend application.

## Project Structure

```
cinematrace/
├── src/
│   ├── app/
│   │   ├── components/              # Main UI components
│   │   ├── models/                  # TypeScript interfaces
│   │   ├── layouts/                 # Reusable shared components
│   │   ├── services/                # API and state services
│   │   └── app.module.ts            # Main module definition
│   ├── assets/                      # Static assets
│   ├── environments/                # Environment configuration
│   └── styles/                      # Global styles and variables
├── angular.json                     # Angular configuration
└── package.json                     # Dependencies and scripts
```

## Key Components

- **Movie Detail**: View comprehensive information about movies including cast, crew, ratings, and user reviews
- **TV Show Detail**: Similar to Movie Detail but with season and episode tracking
- **Profile Page**: View user activity, statistics, watchlist, and custom lists
- **Search Results**: Browse through media with filtering options
- **Home Page**: Personalized dashboard with recommendations and activity feed

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## Building for Production

To build the project for production deployment:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by wonderful [OMDB](https://omdbapi.com)
- Icons by [Font Awesome](https://fontawesome.com)

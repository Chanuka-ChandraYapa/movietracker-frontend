import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomList } from '../../models/user.model';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-custom-lists',
  templateUrl: './custom-lists.component.html',
  styleUrls: ['./custom-lists.component.css'],
  standalone: false
})
export class CustomListsComponent implements OnInit {
  customLists: CustomList[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  constructor(private router: Router,
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.loadLists();
  }

  // loadLists(): void {
  //   this.isLoading = true;
    
  //   // This would be replaced with an actual API call
  //   setTimeout(() => {
  //     // Mock data for demonstration
  //     this.customLists = this.getMockLists();
  //     this.totalPages = Math.ceil(this.customLists.length / 10);
  //     this.isLoading = false;
  //   }, 500);
  // }

  loadLists(page: number = 0): void {
    this.isLoading = true;
    
    this.listService.getAllPublicLists(page)
      .subscribe({
        next: (response) => {
          this.customLists = response.content;
          this.totalPages = response.totalPages;
          this.currentPage = page + 1; // API uses 0-based indexing, UI uses 1-based
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading lists:', error);
          this.isLoading = false;
        }
      });
  }

  navigateToList(id: number): void {
    this.router.navigate(['/lists', id]);
  }

  private getMockLists(): CustomList[] {
    // This is just mock data - in a real app, this would come from your API
    return [
      {
        id: 1,
        name: 'Best Sci-Fi Movies of All Time',
        description: 'A collection of the greatest science fiction films spanning decades, from classic space operas to mind-bending philosophical journeys.',
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 1,
          username: 'filmfanatic',
          email: 'film@example.com',
          displayName: 'Film Enthusiast',
          bio: 'Lover of all things cinema',
          avatarUrl: 'https://i.pravatar.cc/150?img=1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          watchedItems: [],
          reviews: [],
          customLists: [],
          following: [],
          followers: []
        },
        items: [
          {
            id: 101,
            title: 'Blade Runner 2049',
            originalTitle: 'Blade Runner 2049',
            posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
            releaseDate: new Date('2017-10-06'),
            year: 2017,
            overview: 'Thirty years after the events of the first film...',
            genres: [{
              id: 1, name: 'Sci-Fi',
              media: []
            }],
            mediaType: 'movie',
            runtime: 164,
            status: 'Released',
            averageRating: 8.1
          },
          {
            id: 102,
            title: 'Interstellar',
            originalTitle: 'Interstellar',
            posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            releaseDate: new Date('2014-11-07'),
            year: 2014,
            overview: 'Earth\'s future has been riddled by disasters...',
            genres: [{ id: 1, name: 'Sci-Fi', media: [] }, { id: 2, name: 'Adventure', media: [] }],
            mediaType: 'movie',
            runtime: 169,
            status: 'Released',
            averageRating: 8.6
          },
          {
            id: 103,
            title: 'Arrival',
            originalTitle: 'Arrival',
            posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
            releaseDate: new Date('2016-11-11'),
            year: 2016,
            overview: 'Taking place after alien crafts land around the world...',
            genres: [{ id: 1, name: 'Sci-Fi', media: [] }, { id: 3, name: 'Drama', media: [] }],
            mediaType: 'movie',
            runtime: 116,
            status: 'Released',
            averageRating: 7.9
          },
          {
            id: 104,
            title: 'The Matrix',
            originalTitle: 'The Matrix',
            posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            releaseDate: new Date('1999-03-31'),
            year: 1999,
            overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker...',
            genres: [{ id: 1, name: 'Sci-Fi', media: [] }, { id: 4, name: 'Action', media: [] }],
            mediaType: 'movie',
            runtime: 136,
            status: 'Released',
            averageRating: 8.7
          },
          {
            id: 105,
            title: '2001: A Space Odyssey',
            originalTitle: '2001: A Space Odyssey',
            posterUrl: 'https://image.tmdb.org/t/p/w500/ve72VxNqjGM69Uky4WTo76Zyj3M.jpg',
            releaseDate: new Date('1968-04-03'),
            year: 1968,
            overview: 'Humanity finds a mysterious object buried beneath the lunar surface...',
            genres: [{ id: 1, name: 'Sci-Fi', media: [] }],
            mediaType: 'movie',
            runtime: 149,
            status: 'Released',
            averageRating: 8.3
          }
        ]
      },
      {
        id: 2,
        name: 'Top Film Noir Classics',
        description: 'Dark stories, morally ambiguous protagonists, and stark black and white cinematography define these film noir masterpieces.',
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 2,
          username: 'noirmaster',
          email: 'noir@example.com',
          displayName: 'Noir Cinephile',
          bio: 'Shadows and light tell the best stories',
          avatarUrl: 'https://i.pravatar.cc/150?img=2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          watchedItems: [],
          reviews: [],
          customLists: [],
          following: [],
          followers: []
        },
        items: [
          {
            id: 201,
            title: 'Double Indemnity',
            originalTitle: 'Double Indemnity',
            posterUrl: 'https://image.tmdb.org/t/p/w500/taSsGQnqkQ1PxGxlFxKV5JPlRPw.jpg',
            releaseDate: new Date('1944-07-06'),
            year: 1944,
            overview: 'An insurance representative lets himself be talked by a seductive housewife into a murder/insurance fraud scheme...',
            genres: [{ id: 5, name: 'Film Noir', media: [] }, { id: 6, name: 'Crime', media: [] }],
            mediaType: 'movie',
            runtime: 107,
            status: 'Released',
            averageRating: 8.3
          },
          {
            id: 202,
            title: 'The Maltese Falcon',
            originalTitle: 'The Maltese Falcon',
            posterUrl: 'https://image.tmdb.org/t/p/w500/bv3k7zQlSXIjKPG02HUgNzHP8Pj.jpg',
            releaseDate: new Date('1941-10-18'),
            year: 1941,
            overview: 'San Francisco private detective Sam Spade takes on a case that involves him with three eccentric criminals...',
            genres: [{ id: 5, name: 'Film Noir', media: [] }, { id: 7, name: 'Mystery', media: [] }],
            mediaType: 'movie',
            runtime: 100,
            status: 'Released',
            averageRating: 8.1
          },
          {
            id: 203,
            title: 'Touch of Evil',
            originalTitle: 'Touch of Evil',
            posterUrl: 'https://image.tmdb.org/t/p/w500/3ovYUDGQ73PpQPUelQwEgJZJLeU.jpg',
            releaseDate: new Date('1958-04-23'),
            year: 1958,
            overview: 'A stark, perverse story of murder, kidnapping, and police corruption in a Mexican border town.',
            genres: [{ id: 5, name: 'Film Noir', media: [] }, { id: 6, name: 'Crime', media: [] }],
            mediaType: 'movie',
            runtime: 95,
            status: 'Released',
            averageRating: 8.2
          }
        ]
      },
      {
        id: 3,
        name: 'Must-Watch TV Shows',
        description: 'From gripping dramas to hilarious comedies, these television series represent the best of the small screen.',
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 1,
          username: 'filmfanatic',
          email: 'film@example.com',
          displayName: 'Film Enthusiast',
          bio: 'Lover of all things cinema',
          avatarUrl: 'https://i.pravatar.cc/150?img=1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          watchedItems: [],
          reviews: [],
          customLists: [],
          following: [],
          followers: []
        },
        items: [
          {
            id: 301,
            title: 'Breaking Bad',
            originalTitle: 'Breaking Bad',
            posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
            releaseDate: new Date('2008-01-20'),
            year: 2008,
            overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine...',
            genres: [{ id: 8, name: 'Drama', media: [] }, { id: 6, name: 'Crime', media: [] }],
            mediaType: 'tv',
            status: 'Ended',
            averageRating: 9.5,
            numberOfSeasons: 5,
            numberOfEpisodes: 62
          },
          {
            id: 302,
            title: 'The Wire',
            originalTitle: 'The Wire',
            posterUrl: 'https://image.tmdb.org/t/p/w500/4lbclFySvugI51fwsyxBTOm4DqK.jpg',
            releaseDate: new Date('2002-06-02'),
            year: 2002,
            overview: 'The Baltimore drug scene, as seen through the eyes of drug dealers and law enforcement.',
            genres: [{ id: 8, name: 'Drama' , media: []}, { id: 6, name: 'Crime', media: [] }],
            mediaType: 'tv',
            status: 'Ended',
            averageRating: 9.3,
            numberOfSeasons: 5,
            numberOfEpisodes: 60
          },
          {
            id: 303,
            title: 'Succession',
            originalTitle: 'Succession',
            posterUrl: 'https://image.tmdb.org/t/p/w500/oPNITSd8wQNB2zD12RAlAJgTRQI.jpg',
            releaseDate: new Date('2018-06-03'),
            year: 2018,
            overview: 'The saga of the Roy family, a dysfunctional American global-media dynasty.',
            genres: [{ id: 8, name: 'Drama', media: [] }],
            mediaType: 'tv',
            status: 'Ended',
            averageRating: 8.8,
            numberOfSeasons: 4,
            numberOfEpisodes: 39
          }
        ]
      }
    ];
  }
}
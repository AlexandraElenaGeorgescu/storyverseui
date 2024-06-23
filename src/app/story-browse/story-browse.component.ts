import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { StoryModel } from '../models/story.model';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'app-story-browse',
  templateUrl: './story-browse.component.html',
  styleUrls: ['./story-browse.component.css'],
  providers: [DataService],
})
export class StoryBrowseComponent implements OnInit {
  stories: StoryModel[] = [];
  pageSize: number;
  pageId: number;
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;
  selectedGenre: string = '';
  genres: string[] = [];
  sortBy: string = '';

  sortOptions: { key: string, value: string }[] = [
    { key: 'authorDescending', value: 'Author (Z-A)'},
    { key: 'authorAscending', value: 'Author (A-Z)' },
    { key: 'nameDescending', value: 'Title (Z-A)' },
    { key: 'nameAscending', value: 'Title (A-Z)' },
    { key: 'dateCreatedDescending', value: 'Descending by Date' },
    { key: 'dateCreatedAscending', value: 'Ascending by Date' },
    { key: 'reviewCountDescending', value: 'Reviews High to Low' },
    { key: 'reviewCountAscending', value: 'Reviews Low to High' },
    { key: 'bookmarksCountDescending', value: 'Bookmarks High to Low' },
    { key: 'bookmarksCountAscending', value: 'Bookmarks Low to High' },
    { key: 'subscribersCountDescending', value: 'Subscribers High to Low' },
    { key: 'subscribersCountAscending', value: 'Subscribers Low to High' },
    { key: 'averageRatingDescending', value: 'Best Stories High to Low' },
    { key: 'averageRatingAscending', value: 'Best Stories Low to High' }
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    public utils: UtilsService
  ) {
    this.titleService.setTitle('Browse Stories');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.pageSize = +this.route.snapshot.params['pageSize'] || 10;
    this.pageId = +this.route.snapshot.params['pageId'] || 0;
    this.selectedGenre = this.route.snapshot.queryParams['genre'] || '';
    this.sortBy = this.route.snapshot.queryParams['sortBy'] || '';

    this.fetchStories();
    this.fetchGenres();
  }

  ngOnInit() {}

  fetchGenres() {
    this.dataService.get<string[]>('story/genres', genres => {
        this.genres = genres;
    }, error => {
        this.utils.showMessage('There was a problem fetching genres!');
        console.log(`Error response: ${error}`);
    });
}

fetchStories() {
  const genreQuery = this.selectedGenre ? `genre=${this.selectedGenre}&` : '';
  const sortQuery = `sortBy=${this.sortBy}`;
  const query = `story/browse/${this.pageSize}/${this.pageId}?${genreQuery}${sortQuery}`;
  this.dataService.get<StoryModel[]>(
    query,
    (serverStories) => {
      this.stories = serverStories;
      this.prevBtnDisabled = this.pageId <= 0;
      this.nextBtnDisabled = this.stories.length < this.pageSize;
    },
    (error) => {
      this.utils.showMessage('There was a problem!');
      console.log(`Error response: ${error}`);
    }
  );
}

  filterStories() {
    this.pageId = 0;
    this.router.navigate(['/story-browse', this.pageSize, this.pageId], { queryParams: { genre: this.selectedGenre, sortBy: this.sortBy } });
    this.fetchStories();
  }

  updateSort(sortBy: string) {
    this.sortBy = sortBy;
    this.pageId = 0;
    this.router.navigate(['/story-browse', this.pageSize, this.pageId], { queryParams: { genre: this.selectedGenre, sortBy: this.sortBy } });
    this.fetchStories();
  }

  getImageUrl(relativeUrl?: string): string {
    return relativeUrl
      ? `http://localhost:50295/${relativeUrl}`
      : 'http://localhost:50295/StaticFiles/Images/standard.jpg';
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}

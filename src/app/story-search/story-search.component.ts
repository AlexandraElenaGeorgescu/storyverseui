import { Component, OnInit } from '@angular/core';
import { StoryModel } from '../models/story.model';
import { UtilsService } from '../services/utils.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  selector: 'app-story-search',
  templateUrl: './story-search.component.html',
  styleUrls: ['./story-search.component.css'],
  providers: [DataService]
})
export class StorySearchComponent implements OnInit {
  stories: StoryModel[] = [];
  pageSize!: number;
  pageId!: number;
  searchText!: string;
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;

  constructor(private titleService: Title, private router: Router, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
    this.titleService.setTitle('Search Stories');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pageSize = +params['pageSize'];
      this.pageId = +params['pageId'];
      this.searchText = params['searchText'];

      this.dataService.get<StoryModel[]>('story/search/' + this.pageSize + '/' + this.pageId + '/' + this.searchText, serverStories => {
        this.stories = serverStories;
        this.prevBtnDisabled = this.pageId == 0;
        this.nextBtnDisabled = this.stories.length < this.pageSize;
      }, error => {
        this.utils.showMessage('There was a problem!');
        console.log(`Error response: ${error}`);
      });
    });
  }

  getImageUrl(relativeUrl?: string): string {
    return relativeUrl ? `http://localhost:50295/${relativeUrl}` : 'http://localhost:50295/StaticFiles/Images/standard.jpg';
  }
}

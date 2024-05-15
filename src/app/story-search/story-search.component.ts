import { Component, OnInit } from '@angular/core';
import { StoryModel } from '../models/story.model';
import { UtilsService } from '../services/utils.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [
      RouterModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
  ],
  selector: 'app-story-search',
  templateUrl: './story-search.component.html',
  styleUrls: ['./story-search.component.css'],
  providers: [DataService]
})
export class StorySearchComponent implements OnInit {
    stories: StoryModel[] = [];
    pageSize: number;
    pageId: number;
    searchText: string;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

  constructor(private titleService: Title, private router: Router, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
    this.titleService.setTitle('Căutare evenimente');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.pageSize = this.route.snapshot.params['pageSize'];
    this.pageId = this.route.snapshot.params['pageId'];
    this.searchText = this.route.snapshot.params['searchText'];

    this.dataService.get<StoryModel[]>('story/search/' + this.pageSize + '/' + this.pageId + '/' + this.searchText, serverEvents => {
        this.stories = serverEvents;
        this.prevBtnDisabled = this.pageId == 0;
        this.nextBtnDisabled = this.stories.length < this.pageSize; 
    }, error => {
        this.utils.showMessage('A apărut o problemă!');
        console.log(`Error response: ${error}`);
     });
   }

  ngOnInit() {
  }

}

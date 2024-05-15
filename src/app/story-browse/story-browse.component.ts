import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { StoryModel } from '../models/story.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({ 
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        HttpClientModule
    ],
    selector: 'app-story-browse',
    templateUrl: './story-browse.component.html',
    styleUrls: ['./story-browse.component.css'],
    providers: [DataService]
})
export class StoryBrowseComponent implements OnInit {
    stories: StoryModel[] = [];
    pageSize: number;
    pageId: number;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

    constructor(private titleService: Title, private router: Router, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
        this.titleService.setTitle('Navigare evenimente');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.pageSize = this.route.snapshot.params['pageSize'];
        this.pageId = this.route.snapshot.params['pageId'];
        
        this.dataService.get<StoryModel[]>('story/browse/' + this.pageSize + '/' + this.pageId, serverEvents => {
            this.stories = serverEvents;
            this.prevBtnDisabled = this.pageId == 0;
            this.nextBtnDisabled = this.stories.length < this.pageSize; 
        }, error => {
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
         });
    }

    ngOnInit() {}
}

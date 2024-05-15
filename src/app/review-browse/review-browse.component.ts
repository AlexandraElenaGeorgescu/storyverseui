import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { ReviewModel } from '../models/review.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        CommonModule
    ],
    selector: 'app-review-browse',
    templateUrl: './review-browse.component.html',
    styleUrls: ['./review-browse.component.css']
})
export class ReviewBrowseComponent implements OnInit {
    reviews: ReviewModel[] = [];
    storyId: string;
    pageSize: number;
    pageId: number;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

    constructor(private titleService: Title, private router: Router, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
        this.titleService.setTitle('Impresii');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.storyId = this.route.snapshot.params['storyId'];
        this.pageSize = this.route.snapshot.params['pageSize'];
        this.pageId = this.route.snapshot.params['pageId'];
        
        this.dataService.get<ReviewModel[]>('review/browse/' + this.storyId + '/' + this.pageSize + '/' + this.pageId, serverReviews => {
            this.reviews = serverReviews;
            this.prevBtnDisabled = this.pageId == 0;
            this.nextBtnDisabled = this.reviews.length < this.pageSize;
        }, error => { 
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
        });
     }

    ngOnInit() { }
}

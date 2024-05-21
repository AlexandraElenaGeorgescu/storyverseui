import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReviewModel } from '../../models/review.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../../services/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    selector: 'app-review-edit',
    templateUrl: './review-edit.component.html',
    styleUrls: ['./review-edit.component.css'],
    providers: [DataService]
})
export class ReviewEditComponent implements OnInit {

    review: ReviewModel = new ReviewModel();
    storyId: string;
    ratingCheck: Boolean = false;

    constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
        this.titleService.setTitle('Your Review');
        this.storyId = this.route.snapshot.params['id'];
        
        this.dataService.get<ReviewModel>('review/get/' + this.storyId, serverReview => {
            this.review = serverReview;
            this.updateRating(this.review.rating);
        }, error => { 
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, localStorage.getItem('user-token') ?? '');
    }

    ngOnInit() { }

    onSubmit() {
        this.dataService.put('review/edit/' + this.storyId, success => {
            this.utils.showMessage('Your review has been updated!');
        }, error => {
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, this.review, localStorage.getItem('user-token') ?? undefined);
    }

    deleteReview() {
        this.dataService.delete('review/delete/' + this.storyId, success => {
            this.review = new ReviewModel();
            this.updateRating(this.review.rating);
            this.utils.showMessage('Your review has been deleted!');
        }, error => { 
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, localStorage.getItem('user-token') ?? '');
    }

    updateRating(newRating: number): void {
        this.utils.syncRatingWithStars(newRating, { review: this.review });
        this.ratingCheck = this.review.rating > 0 ? true : false;
    }
}

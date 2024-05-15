import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    selector: 'app-review-edit',
    templateUrl: './review-edit.component.html',
    styleUrls: ['./review-edit.component.css']
})
export class ReviewEditComponent implements OnInit {

    review: ReviewModel = new ReviewModel();
    eventId: string;
    ratingCheck: Boolean = false;

    constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
        this.titleService.setTitle('Impresia ta');
        this.eventId = this.route.snapshot.params['id'];
        
        this.dataService.get<ReviewModel>('review/get/' + this.eventId, serverReview => {
            this.review = serverReview;
            this.updateRating(this.review.rating);
        }, error => { 
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
        }, localStorage.getItem('user-token') ?? '');
    }

    ngOnInit() { }

    onSubmit() {
        this.dataService.put('review/edit/' + this.eventId, success => {
            this.utils.showMessage('Impresia ta a fost actualizată!');
        }, error => {
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
         }, this.review, localStorage.getItem('user-token') ?? undefined);
    }

    deleteReview() {
        this.dataService.delete('review/delete/' + this.eventId, success => {
            this.review = new ReviewModel();
            this.updateRating(this.review.rating);
            this.utils.showMessage('Impresia ta a fost ștearsă!');
        }, error => { 
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
        }, localStorage.getItem('user-token') ?? '');
    }

    updateRating(newRating: number): void {
        this.utils.syncRatingWithStars(newRating, {review: this.review});
        this.ratingCheck = this.review.rating > 0 ? true : false;
    }
}

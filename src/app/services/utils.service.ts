import { Injectable } from "@angular/core";
import { ReviewModel } from "../models/review.model";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    syncRatingWithStars(rating: number, boxedReview: {review: ReviewModel}): void {
        boxedReview.review.rating = rating;
        for (var i = 1; i <= 5; i++) {
            document.getElementById("star-" + i)?.classList.remove("text-warning");
            if (rating >= i) {
                document.getElementById("star-" + i)?.classList.add("text-warning");
            }
        }
    }

    showMessage(message: string): void {
        var body: HTMLElement = document.getElementsByTagName('body')[0];
        var outerDiv: HTMLElement = document.createElement('div');
        var innerDiv: HTMLElement = document.createElement('div');

        outerDiv.classList.add('fixed-bottom', 'text-center', 'p-0', 'm-0', 'mb-3');
        innerDiv.classList.add('alert', 'alert-danger', 'd-inline-block', 'col-10', 'col-sm-8', 'col-md-6', 'col-lg-4', 'col-xl-4');
        innerDiv.setAttribute('role', 'alert');
        innerDiv.innerHTML = message;

        outerDiv.appendChild(innerDiv);
        body.appendChild(outerDiv);

        setTimeout(() => {
            body.removeChild(outerDiv);
        }, 2000);
    }

    getStringDate(date: Date): string {
        var _date:Date = new Date(date);
        
        var year:number = _date.getFullYear();
        var month:number = _date.getMonth() + 1;
        var day:number = _date.getUTCDate();
        var hour:number = _date.getHours();
        var min:number = _date.getMinutes();
        
        var sYear = this.padder(year, 4);
        var sMonth = this.padder(month, 2);
        var sDay = this.padder(day, 2);
        var sHour = this.padder(hour, 2);
        var sMin = this.padder(min, 2);
        
        return sYear + '-' + sMonth + '-' + sDay + ' ' + sHour + ':' + sMin;
    }

    padder(num: string | number, padlen: number) {
        var pad = new Array(1 + padlen).join('0');
        return (pad + num).slice(-pad.length);
    }
}
export class ReviewModel {
    rating: number;
    opinion: string;
    lastEdit: string;
    userName: string;

    constructor() {
        this.rating = 0;
        this.opinion = '';
        this.lastEdit = '2015-10-20 22:45';
        this.userName = '';
    }
}
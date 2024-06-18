export class ReviewModel {
    rating: number;
    opinion: string;
    lastEdit: string;
    userName: string;
    avatarUrl: string; 

    constructor() {
        this.rating = 0;
        this.opinion = '';
        this.lastEdit = '';
        this.userName = '';
        this.avatarUrl = ''; 
    }
}

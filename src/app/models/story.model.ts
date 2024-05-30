export class StoryModel {
    id!: string;
    name!: string;
    dateCreated!: string;
    genre!: string;
    description!: string;
    actualStory!: string;
    image?: string;
    author!: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.dateCreated = '2024-06-21 02:00';
        this.genre = 'SF';
        this.actualStory = '';
        this.description = '';
        this.image = '';
        this.author = '';
    }
}

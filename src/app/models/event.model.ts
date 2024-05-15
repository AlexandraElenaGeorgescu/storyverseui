export class EventModel{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    url: string;
    image: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.startDate = '2020-06-15 02:00';
        this.endDate = '2020-06-16 03:30';
        this.location = '';
        this.description = '';
        this.url = '';
        this.image = '';
    }
}
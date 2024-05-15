export class UserModel {
    email: string;
    password: string;
    birthday: string;
    name: string;
    surname: string;
    
    constructor() {
        this.email = '';
        this.password = '';
        this.birthday = '1990-06-16 00:00';
        this.name = '';
        this.surname = '';
    }
}
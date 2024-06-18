export class UserModel {
    email: string;
    password: string;
    birthday: string; // Allow birthday to be either a string or a Date
    name: string;
    surname: string;
    avatar?: string;

    constructor() {
        this.email = '';
        this.password = '';
        this.birthday = '';
        this.name = '';
        this.surname = '';
        this.avatar = '';
    }
}

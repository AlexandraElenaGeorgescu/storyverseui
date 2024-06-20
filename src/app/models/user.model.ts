export class UserModel {
    email: string;
    password: string;
    birthday: string; 
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

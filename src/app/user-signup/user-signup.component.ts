import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { UserModel } from '../models/user.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule
    ],
    selector: 'app-user-signup',
    templateUrl: './user-signup.component.html',
    styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {
    user: UserModel = new UserModel();
    birthday!: Date;

    constructor(private titleService: Title, private router: Router, private dataService: DataService, private utils: UtilsService) {
        localStorage.removeItem('user-token');
        this.titleService.setTitle('Autentificare / Înregistrare');
    }

    ngOnInit() { }

    onSubmit() {
        this.user.birthday = this.utils.getStringDate(this.birthday);
        this.dataService.post<string>('user/signup', response => {
            this.utils.showMessage('Te-ai înregistrat cu succes!');
            this.router.navigate(['user-dashboard/registered-storys/5/0']);
        }, error => { 
            if( error == 'Email used' ) {
                this.utils.showMessage('Există deja un utilizator cu aceași adresă de email!');
            } else {
                this.utils.showMessage('A apărut o problemă!');
            }
            console.log(`Error response: ${error}`);
        }, this.user);
    }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { UserModel } from '../models/user.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        CommonModule
    ],
    selector: 'app-user-signup',
    templateUrl: './user-signup.component.html',
    styleUrls: ['./user-signup.component.css'],
    providers: [DataService]
})
export class UserSignupComponent implements OnInit {
    user: UserModel = new UserModel();
    birthday!: Date;
    verificationCode: string = '';
    emailSent: boolean = false;

    constructor(private titleService: Title, private router: Router, private dataService: DataService, private utils: UtilsService) {
        localStorage.removeItem('user-token');
        this.titleService.setTitle('Sign In / Sign Up');
    }

    ngOnInit() { }

    onSubmit() {
        this.user.birthday = this.utils.getStringDate(this.birthday);
        var textInput: HTMLInputElement = document.getElementById("userEmailFormControl") as HTMLInputElement;
        this.dataService.post<string>('user/send-verification-code', response => {
            this.emailSent = true;
            this.utils.showMessage('Verification code sent to your email');
        }, error => {
            if (error === 'Email already used') {
                this.utils.showMessage('A user with this email address already exists!');
            } else {
                this.utils.showMessage('There was a problem!');
            }
            console.log(`Error response: ${error}`);
        }, { email: textInput.value });
        
    }

    verifyCode() {
        const payload = { VerificationCode: this.verificationCode, User: this.user };
        this.dataService.post<string>('user/verify-code-and-signup', response => {
            this.utils.showMessage('You have successfully signed up!');
            this.router.navigate(['user-dashboard/registered-stories/5/0']);
        }, error => {
            this.utils.showMessage('Invalid verification code!');
            console.log(`Error response: ${error}`);
        }, payload);
    }
}

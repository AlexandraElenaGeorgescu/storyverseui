import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../models/user.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule
  ],
  selector: 'app-user-signin',
  templateUrl: './user-signin.component.html',
  styleUrls: ['./user-signin.component.css'],
  providers: [DataService]
})
export class UserSigninComponent implements OnInit {
    user: UserModel = new UserModel();

    constructor(private titleService: Title, private router: Router, private dataService: DataService, private utils: UtilsService) { 
        localStorage.removeItem('user-token');
        this.titleService.setTitle('Sign In / Sign Up');
        this.user.email = 'user1@mockup.com';
        this.user.password = 'Password1';
    }

    ngOnInit() {}

    onSubmit() {
        this.dataService.post<string>('user/signin', userToken => {
            this.utils.showMessage('You have successfully signed in!');
            localStorage.setItem('user-token', userToken);
            this.router.navigate(['user-dashboard/registered-stories/5/0']);
        }, (error: string) => {
            this.utils.showMessage('Please check your email and password again!');
            console.log(`Error response: ${error}`);
        }, this.user);
    }

    recoverEmailBtnClick() {
        var textInputCheck: HTMLInputElement = document.getElementById("userEmailFormControlCheck") as HTMLInputElement;
        var textInput: HTMLInputElement = document.getElementById("userEmailFormControl") as HTMLInputElement;
        if (textInputCheck.hidden == true) {
            this.dataService.get<string>('user/send-password/' + textInput.value, resp => {
                this.utils.showMessage(resp);
            }, (error: string) => {
                this.utils.showMessage('There was a problem!');
                console.log(`Error response: ${error}`);
            });
        } else {
            this.utils.showMessage('Enter the email address! The password field will be ignored.')
        }
    }
}

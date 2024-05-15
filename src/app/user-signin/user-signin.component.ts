import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../models/user.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [ 
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
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
        this.titleService.setTitle('Autentificare / Înregistrare');
        this.user.name = 'user1@mockup.com';
        this.user.name = 'Password1';
    }

    ngOnInit() {}

    onSubmit(){
        this.dataService.post<string>('user/signin', userToken => {
            this.utils.showMessage('Te-ai autentificat cu success!');
            localStorage.setItem('user-token', userToken);
            this.router.navigate(['user-dashboard/registered-storys/5/0']);
        }, (error: string) => {
            this.utils.showMessage('Verificați din nou adresa de email și parola!');
            console.log(`Error response: ${error}`);
        }, this.user);
    }

    recoverEmailBtnClick() {
        var textInputCheck: HTMLInputElement = document.getElementById("userEmailFormControlCheck") as HTMLInputElement;
        var textInput: HTMLInputElement = document.getElementById("userEmailFormControl") as HTMLInputElement;
        if(textInputCheck.hidden == true) {
            this.dataService.get<string>('user/send-password/' + textInput.value, resp => {
                this.utils.showMessage(resp);
            }, (error: string) => {
                this.utils.showMessage('A apărut o problemă!');
                console.log(`Error response: ${error}`);
            });
        }else{
            this.utils.showMessage('Introdu adresa de email! Câmpul pentru parolă va fi ignorat.')
        }
    }
}
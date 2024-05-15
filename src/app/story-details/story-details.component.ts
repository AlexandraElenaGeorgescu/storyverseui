import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StoryModel } from '../models/story.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    selector: 'app-story-details',
    templateUrl: './story-details.component.html',
    styleUrls: ['./story-details.component.css']
})
export class StoryDetailsComponent implements OnInit {
    storyId: string;
    storyM: StoryModel = new StoryModel;
    registrationStatus: string = "";
    googleApiKey: string;

    constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
        this.titleService.setTitle('Detalii eveniment');
        this.storyId = this.route.snapshot.params['id'];
        this.googleApiKey = this.dataService.getGoogleMapsAPiKey();
        
        this.dataService.get<StoryModel>('story/details/' + this.storyId, serverEvent => {
            this.storyM = serverEvent;
            // this.storyM.image = this.dataService.getImageAbsoluteUrl(this.storyM.image);
            dataService.get<string>('user/registration-status/' + this.storyId, serverRegistrationStatus => {
                this.registrationStatus = serverRegistrationStatus;
                this.showBtns();
            }, error => {
                this.registrationStatus = 'unauthenticated';
                this.showBtns();
                console.log(`Error response: ${error}`);
            }, localStorage.getItem('user-token') ?? '');
        }, error => {
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
         });
    }

    ngOnInit() { }

    showBtns() {
        switch(this.registrationStatus) {
            case ('unauthenticated'): {
                const btnLogin = document.getElementById('btnLogin');
                if (btnLogin) {
                    btnLogin.removeAttribute('hidden');
                }
                break;
            }
            case ('creator'): {
                const btnChat = document.getElementById('btnChat');
                if (btnChat) {
                    btnChat.removeAttribute('hidden');
                }
                const btnCreator = document.getElementById('btnCreator');
                if (btnCreator) {
                    btnCreator.removeAttribute('hidden');
                }
                break;
            }
            case ('registered'): {
                const btnChat = document.getElementById('btnChat');
                if (btnChat) {
                    btnChat.removeAttribute('hidden');
                }
                const btnRegister = document.getElementById('btnRegister');
                if (btnRegister) {
                    btnRegister.removeAttribute('hidden');
                    btnRegister.innerText = 'Ești înscris (anulează)';
                }
                const btnYourReview = document.getElementById('btnYourReview');
                if (btnYourReview) {
                    btnYourReview.style.display = 'inline-block';
                }
                break;
            }
            case ('unregistered'): {
                const btnChat = document.getElementById('btnChat');
                if (btnChat) {
                    btnChat.removeAttribute('hidden');
                }
                const btnRegister = document.getElementById('btnRegister');
                if (btnRegister) {
                    btnRegister.removeAttribute('hidden');
                    btnRegister.innerText = 'Înscrie-te';
                }
                break;
            }
        }
    }

    btnRegisterClick() {
        if (this.registrationStatus == 'unregistered') {

            this.dataService.patch<Boolean>('user/register/' + this.storyId, response => {
                this.registrationStatus = 'registered';
                document.getElementById('btnRegister')!.innerText = 'Ești înscris (anulează)';
                this.utils.showMessage('Ai fost înscris!');
                document.getElementById('btnYourReview')!.style.display = 'inline-block';
            }, error => {
                this.utils.showMessage('A apărut o problemă!');
                console.log(`Error response: ${error}`);
            }, undefined, localStorage.getItem('user-token') ?? "");

        } else if (this.registrationStatus == 'registered') {

            this.dataService.patch<Boolean>('user/unregister/' + this.storyId, response => {
                this.registrationStatus = 'unregistered';
                const btnRegister = document.getElementById('btnRegister');
                if (btnRegister) {
                    btnRegister.innerText = 'Înscrie-te';
                }
                this.utils.showMessage('Înregistrarea ta a fost anulată!');
                const btnYourReview = document.getElementById('btnYourReview');
                if (btnYourReview) {
                    btnYourReview.style.removeProperty('display');
                    btnYourReview.style.display = 'none';
                }
            }, error => {
                this.utils.showMessage('A apărut o problemă!');
                console.log(`Error response: ${error}`);
            }, undefined, localStorage.getItem('user-token') ?? "");

        }
    }
}

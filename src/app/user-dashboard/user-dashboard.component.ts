import { Component, OnInit } from '@angular/core';
import { StoryModel } from '../models/story.model';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { UserModel } from '../models/user.model';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule
    ],
    selector: 'app-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css'],
    providers: [DataService]
})
export class UserDashboardComponent implements OnInit {
    stories: StoryModel[] = [];
    listType: string;
    pageSize: number;
    pageId: number;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;
    myAcc: UserModel = new UserModel;

    constructor(private titleService: Title, private router: Router, private route: ActivatedRoute, private dataService: DataService, private utils: UtilsService) {
        this.titleService.setTitle('Contul tău');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.listType = this.route.snapshot.params['listType'];
        this.pageSize = this.route.snapshot.params['pageSize'];
        this.pageId = this.route.snapshot.params['pageId'];

        const token = localStorage.getItem('user-token') || undefined;

        this.dataService.get<StoryModel[]>('user/' + this.listType + '/' + this.pageSize + '/' + this.pageId, (serverEvents: StoryModel[]) => {
            this.stories = serverEvents;
            this.prevBtnDisabled = this.pageId == 0;
            this.nextBtnDisabled = this.stories.length < this.pageSize;
        }, (error: any) => {
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
        }, token);

        this.dataService.get<UserModel>('user/who-i-am', (user: UserModel) => {
            this.myAcc = user
        }, (error: any) => {
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
        }, token);
    }

    ngOnInit() { }

    changePassBtnClick(): void {
        var newPass: string = (<HTMLInputElement>(document.getElementById("new-pass-input"))).value;
        var passWrap: UserModel = new UserModel();
        passWrap.password = newPass;

        this.dataService.patch<any>('user/change-password', (resp: any) => {
            this.utils.showMessage('Parolă schimbată cu success!');
        }, (error: any) => {
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
        }, passWrap, localStorage.getItem('user-token') || undefined);
    }
}

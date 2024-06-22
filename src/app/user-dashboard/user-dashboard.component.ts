import { Component, OnInit } from '@angular/core';
import { StoryModel } from '../models/story.model';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { UserModel } from '../models/user.model';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        FormsModule
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
    myAcc: UserModel = new UserModel();
    createdStoriesCount: number = 0;
    reviewedStoriesCount: number = 0;
    registeredStoriesCount: number = 0;
    currentDate: Date = new Date();
    storyToDelete: string | null = null;
    avatars: string[] = [
        'assets/1.png',
        'assets/2.png',
        'assets/3.png',
        'assets/4.png',
        'assets/5.png',
        'assets/6.png',
        'assets/7.png',
        'assets/8.png',
        'assets/9.png',
        'assets/10.png',
        'assets/11.png',
        'assets/12.png',
        'assets/13.png',
        'assets/14.png',
        'assets/15.png',
        'assets/16.png',
        'assets/17.png',
    ];
    selectedAvatar: string | undefined;
    bookmarkedStories: StoryModel[] = [];
    recommendations: StoryModel[] = [];

    constructor(private titleService: Title, private router: Router, private route: ActivatedRoute, private dataService: DataService, private utils: UtilsService) {
        this.titleService.setTitle('Your Account');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.listType = this.route.snapshot.params['listType'];
        this.pageSize = this.route.snapshot.params['pageSize'];
        this.pageId = this.route.snapshot.params['pageId'];

        const token = localStorage.getItem('user-token') || undefined;

        this.dataService.get<StoryModel[]>('user/' + this.listType + '/' + this.pageSize + '/' + this.pageId, (serverStories: StoryModel[]) => {
            this.stories = serverStories;
            this.prevBtnDisabled = this.pageId <= 0;
            this.nextBtnDisabled = this.stories.length < this.pageSize;
            }, (error: any) => {
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, token);

        this.dataService.get<UserModel>('user/who-i-am', (user: UserModel) => {
            this.myAcc = user;
            this.myAcc.birthday = user.birthday; 
            this.myAcc.avatar = user.avatar;
        }, (error: any) => {
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, token);
    }

    ngOnInit() { 
        this.loadBookmarkedStories();
        this.loadRecommendations();
    }
    
    loadBookmarkedStories(): void {
        const token = localStorage.getItem('user-token') || undefined;
        this.dataService.get<StoryModel[]>('story/bookmarked-stories', (serverStories: StoryModel[]) => {
            this.bookmarkedStories = serverStories;
        }, (error: any) => {
            this.utils.showMessage('There was a problem loading bookmarked stories!');
            console.log(`Error response: ${error}`);
        }, token);
    }
    
    loadRecommendations(): void {
        const token = localStorage.getItem('user-token') || undefined;
        this.dataService.get<StoryModel[]>('story/recommendations', (serverStories: StoryModel[]) => {
            this.recommendations = serverStories;
        }, (error: any) => {
            this.utils.showMessage('There was a problem loading recommendations!');
            console.log(`Error response: ${error}`);
        }, token);
    }    

    changePassBtnClick(): void {
        const newPass: string = (document.getElementById("new-pass-input") as HTMLInputElement).value;
        const passWrap: UserModel = new UserModel();
        passWrap.password = newPass;

        this.dataService.patch<any>('user/change-password', (resp: any) => {
            this.utils.showMessage('Password changed successfully!');
        }, (error: any) => {
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, passWrap, localStorage.getItem('user-token') || undefined);
    }

    editStory(storyId: string): void {
        this.router.navigate(['/edit-story', storyId]);
    }

    confirmDeleteStory(storyId: string): void {
        this.storyToDelete = storyId;
        this.openModal('confirmDeleteModal');
    }

    deleteStory(): void {
        if (!this.storyToDelete) return;
        const token = localStorage.getItem('user-token') || undefined;
        this.dataService.delete<any>(`story/${this.storyToDelete}`, (response: any) => {
            this.utils.showMessage('Story deleted successfully!');
            this.stories = this.stories.filter(story => story.id !== this.storyToDelete);
            this.closeModal('confirmDeleteModal');
        }, (error: any) => {
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, token);
    }

    updateNameAndSurname(): void {
        const updatedUser: UserModel = { ...this.myAcc }; // Clone the current user details
        updatedUser.name = (document.getElementById('new-name-input') as HTMLInputElement).value;
        updatedUser.surname = (document.getElementById('new-surname-input') as HTMLInputElement).value;
    
        this.dataService.patch<any>('user/update-name', (response: any) => {
            this.utils.showMessage('Name and surname updated successfully!');
            this.myAcc = updatedUser; // Update the local user object
        }, (error: any) => {
            this.utils.showMessage('There was a problem updating your name and surname!');
            console.log(`Error response: ${error}`);
        }, updatedUser, localStorage.getItem('user-token') || undefined);
    }

    confirmDeleteAccount(): void {
        this.openModal('confirmDeleteAccountModal');
    }

    deleteAccount(): void {
        const token = localStorage.getItem('user-token') || undefined;
        this.dataService.delete<any>('user/delete-account', (response: any) => {
            this.utils.showMessage('Account and related data deleted successfully!');
            localStorage.removeItem('user-token');
            this.router.navigate(['/user-signin']);
            this.closeModal('confirmDeleteAccountModal');
        }, (error: any) => {
            this.utils.showMessage('There was a problem deleting your account!');
            console.log(`Error response: ${error}`);
        }, token);
    }

    openModal(id: string): void {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(id: string): void {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    selectAvatar(avatar: string): void {
        this.myAcc.avatar = avatar;
    }

    updateAvatar(): void {
        const updatedUser: UserModel = { ...this.myAcc };
        this.dataService.patch<any>('user/update-avatar', (response: any) => {
            this.closeModal('avatarSelectionModal');
            this.utils.showMessage('Avatar updated successfully!');
        }, (error: any) => {
            this.utils.showMessage('There was a problem updating your avatar!');
            console.log(`Error response: ${error}`);
        }, updatedUser, localStorage.getItem('user-token') || undefined);
    }
}

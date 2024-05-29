import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { StoryModel } from '../models/story.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule
    ],
    selector: 'app-story-create',
    templateUrl: './story-create.component.html',
    styleUrls: ['./story-create.component.css'],
    providers: [DataService]
})

export class StoryCreateComponent implements OnInit {
    storyM: StoryModel = new StoryModel();
    fileToUpload: File | null = null;

    public progress!: number;
    public message!: string;

    constructor(private titleService: Title, private router: Router, private dataService: DataService, private utils: UtilsService, private http: HttpClient) {
        this.titleService.setTitle('Create Story');
    }

    ngOnInit() { }

    onSubmit() {
        this.dataService.post<string>('story/create', storyId => {
            this.uploadFile(storyId);
            this.utils.showMessage('Story created successfully!');
            this.router.navigate(['/user-dashboard/created-stories/5/0']);
        }, error => {
            this.utils.showMessage('There was a problem!');
            console.log(`Error response: ${error}`);
        }, this.storyM, localStorage.getItem('user-token') ?? "");
    }

    selectFile(files: FileList) {
        if (files.length > 0) {
            this.fileToUpload = files.item(0);
        }
    }

    public uploadFile(storyId: string) {
        if (this.fileToUpload == null) {
            return;
        }
    
        const formData = new FormData();
        formData.append('file', this.fileToUpload, this.fileToUpload.name);
    
        this.dataService.post(`story/upload-image/${storyId}`, (success) => {
            // handle success
        }, (error) => {
            this.utils.showMessage('There was a problem uploading the image!');
            console.log(`Error response: ${error}`);
        }, formData, localStorage.getItem('user-token') ?? "");
    }    
}
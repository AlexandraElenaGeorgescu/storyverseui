import { Component, OnInit, SimpleChange } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { StoryModel } from '../models/story.model';
import { Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';

import { Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    selector: 'app-story-create',
    templateUrl: './story-create.component.html',
    styleUrls: ['./story-create.component.css'],
    providers: [DataService]
})
export class StoryCreateComponent implements OnInit {
        storyM: StoryModel = new StoryModel();
        startDate!: Date;
        endDate!: Date;
        fileToUpload: File | null = null;

    public progress!: number;
    public message!: string;

        constructor(private titleService: Title, private router: Router, private dataService: DataService, private utils: UtilsService, private http: HttpClient) {
                this.titleService.setTitle('Creare eveniment');
        }

        ngOnInit() { }

    onSubmit() {
        this.storyM.startDate = this.utils.getStringDate(this.startDate);
        this.storyM.endDate = this.utils.getStringDate(this.endDate);
        
        this.dataService.post<string>('story/create', storyId => {
            this.uploadFile();
            this.utils.showMessage('Evenimentul a fost creat!');
            this.router.navigate(['/user-dashboard/created-storys/5/0']);
        }, error => {
            this.utils.showMessage('A apărut o problemă!');
            console.log(`Error response: ${error}`);
        }, this.storyM, localStorage.getItem('user-token') ?? "");
    }

    selectFile(files: string) {
        if (files.length === 0) {
            return;
          }
      
          this.fileToUpload = <File><unknown>files[0];
    }

    public uploadFile = () => {
        if(this.fileToUpload == null)
            return;

        const formData = new FormData();
        formData.append('file', this.fileToUpload, this.fileToUpload.name);
    
        this.dataService.post('story/upload-image', success => {}, error => {
            this.utils.showMessage('A apărut o problemă la încărcarea imaginii!');
            console.log(`Error response: ${error}`);
        }, formData, localStorage.getItem('user-token') ?? "");
      }
}

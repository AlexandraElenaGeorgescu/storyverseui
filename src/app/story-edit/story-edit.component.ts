import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    selector: 'app-story-edit',
    templateUrl: './story-edit.component.html',
    styleUrls: ['./story-edit.component.css'],
    providers: [DataService]
})

export class StoryEditComponent implements OnInit {
    storyM: StoryModel = new StoryModel();
    fileToUpload: File | null = null;

    public progress!: number;
    public message!: string;

    constructor(private titleService: Title, private router: Router, private route: ActivatedRoute, private dataService: DataService, private utils: UtilsService, private http: HttpClient) {
        this.titleService.setTitle('Edit Story');
    }

    ngOnInit() {
        this.loadStoryData();
    }

    loadStoryData() {
        const storyId = this.route.snapshot.paramMap.get('id');
        this.dataService.get<StoryModel>(`story/details/${storyId}`, (story: StoryModel) => {
            this.storyM = story;
        }, (error: any) => {
            this.utils.showMessage('There was a problem loading the story!');
            console.log(`Error response: ${error}`);
        });
    }

    onSubmit() {
        this.dataService.put<string>(`story/update/${this.storyM.id}`, storyId => {
            this.uploadFile(storyId);
            this.utils.showMessage('Story updated successfully!');
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

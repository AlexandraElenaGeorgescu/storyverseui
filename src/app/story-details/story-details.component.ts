import { Component, OnInit, Renderer2 } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StoryModel } from '../models/story.model';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    selector: 'app-story-details',
    templateUrl: './story-details.component.html',
    styleUrls: ['./story-details.component.css'],
    providers: [DataService]
})
export class StoryDetailsComponent implements OnInit {
    storyId: string;
    storyM: StoryModel = new StoryModel();
    registrationStatus: string = "";
    fontSize: number = 16;

    constructor(
        private sanitizer: DomSanitizer,
        private titleService: Title,
        private route: ActivatedRoute,
        private dataService: DataService,
        public utils: UtilsService,
        private renderer: Renderer2
    ) {
        this.titleService.setTitle('Story Details');
        this.storyId = this.route.snapshot.params['id'];

        this.dataService.get<StoryModel>('story/details/' + this.storyId, serverEvent => {
            this.storyM = serverEvent;
            this.dataService.get<string>('user/registration-status/' + this.storyId, serverRegistrationStatus => {
                this.registrationStatus = serverRegistrationStatus;
                this.showBtns();
                this.applyFontSizeToContent(); // Ensure font size is applied after content load
            }, error => {
                this.registrationStatus = 'unauthenticated';
                this.showBtns();
                this.applyFontSizeToContent(); // Ensure font size is applied even on error
                console.log(`Error response: ${error}`);
            }, localStorage.getItem('user-token') ?? '');
        }, error => {
            this.utils.showMessage('There was a problem!');
            this.applyFontSizeToContent(); // Ensure font size is applied even on error
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
                    btnRegister.innerText = 'Registered (cancel)';
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
                    btnRegister.innerText = 'Register';
                }
                break;
            }
        }
    }

    btnRegisterClick() {
        if (this.registrationStatus == 'unregistered') {
            this.dataService.patch<Boolean>('user/register/' + this.storyId, response => {
                this.registrationStatus = 'registered';
                document.getElementById('btnRegister')!.innerText = 'Registered (cancel)';
                this.utils.showMessage('You have been registered!');
                document.getElementById('btnYourReview')!.style.display = 'inline-block';
            }, error => {
                this.utils.showMessage('There was a problem!');
                console.log(`Error response: ${error}`);
            }, undefined, localStorage.getItem('user-token') ?? "");
        } else if (this.registrationStatus == 'registered') {
            this.dataService.patch<Boolean>('user/unregister/' + this.storyId, response => {
                this.registrationStatus = 'unregistered';
                const btnRegister = document.getElementById('btnRegister');
                if (btnRegister) {
                    btnRegister.innerText = 'Register';
                }
                this.utils.showMessage('Your registration has been canceled!');
                const btnYourReview = document.getElementById('btnYourReview');
                if (btnYourReview) {
                    btnYourReview.style.removeProperty('display');
                    btnYourReview.style.display = 'none';
                }
            }, error => {
                this.utils.showMessage('There was a problem!');
                console.log(`Error response: ${error}`);
            }, undefined, localStorage.getItem('user-token') ?? "");
        }
    }

    getImageUrl(relativeUrl?: string): string {
        return relativeUrl ? `http://localhost:50295/${relativeUrl}` : 'http://localhost:50295/StaticFiles/Images/standard.jpg';
    }

    sanitizeContent(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.sanitizeAndCleanContent(content));
    }

    sanitizeAndCleanContent(content: string): string {
        // Create a temporary DOM element to manipulate the content
        const tempElement = document.createElement('div');
        tempElement.innerHTML = content;

        // Remove all inline styles recursively
        this.removeInlineStyles(tempElement);

        // Return the cleaned HTML
        return tempElement.innerHTML;
    }

    removeInlineStyles(element: HTMLElement) {
        // Set font size directly
        this.renderer.setStyle(element, 'fontSize', `${this.fontSize}px`);
        
        // Recursively remove inline styles and set font size
        Array.from(element.children).forEach(child => {
            this.removeInlineStyles(child as HTMLElement);
        });
    }

    changeFontSize(action: string) {
        if (action === 'increase') {
            this.fontSize += 2;
        } else if (action === 'decrease') {
            this.fontSize -= 2;
        }
        this.applyFontSizeToContent(); // Apply font size after changing it
    }

    applyFontSizeToContent() {
        const contentContainers = document.querySelectorAll('.content-modal');
        contentContainers.forEach(container => {
            this.removeInlineStyles(container as HTMLElement);
        });
    }

bookmarkStory(storyId: string): void {
    const token = localStorage.getItem('user-token') || undefined;
    this.dataService.patch<any>(
        `story/bookmark-story/${storyId}`, 
        (response: any) => {
            this.utils.showMessage('Story bookmarked successfully!');
        }, 
        (error: any) => {
            this.utils.showMessage('There was a problem bookmarking the story!');
            console.log(`Error response: ${error}`);
        }, 
        {}, 
        token
    );
}
}

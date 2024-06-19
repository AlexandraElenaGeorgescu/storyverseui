import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-featured-stories',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DataService],
  templateUrl: './featured-stories.component.html',
  styleUrl: './featured-stories.component.css',
})
export class FeaturedStoriesComponent implements OnInit {
  highestRated: any;
  mostSubscribed: any;
  mostBookmarked: any;

  constructor(private dataService: DataService, private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadFeaturedStories();
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.sanitizeAndCleanContent(content)
    );
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
    
    Array.from(element.children).forEach(child => {
        this.removeInlineStyles(child as HTMLElement);
    });
  }

  getImageUrl(relativeUrl?: string): string {
    return relativeUrl
      ? `http://localhost:50295/${relativeUrl}`
      : 'http://localhost:50295/StaticFiles/Images/standard.jpg';
  }

  loadFeaturedStories(): void {
    this.dataService.get<any>(
      'story/featured',
      (data) => {
        console.log('Featured stories data:', data);
        this.highestRated = data.highestRated[0];
        this.mostSubscribed = data.mostSubscribed[0];
        this.mostBookmarked = data.mostBookmarked[0];
      },
      (error) => {
        console.error('Error fetching featured stories', error);
      }
    );
  }
}

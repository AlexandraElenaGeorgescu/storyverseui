import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
declare var Chartist: any;

class ReviewsInfo {
    nrReviews: number;
    averageRating: number;
    constructor(data: any[]) {
        this.nrReviews = data[0] || 0;
        this.averageRating = Math.round((data[1] || 0) * 100) / 100;
    }
}

class LineInfo {
    startDate: string;
    endDate: string;
    total: string;
    constructor(data: string[]) {
        this.startDate = data[0] || 'N/A';
        this.endDate = data[1] || 'N/A';
        this.total = data[2] || '0';
    }
}

class PieInfo {
    subscribedToThisStory: number;
    subscribedToOthers: number;
    subscribedBoth: number;
    subscribedTotal: number;
    thisRatio: number;
    othersRatio: number;
    bothRatio: number;

    constructor(data: number[]) {
        this.subscribedToThisStory = data[0];
        this.subscribedToOthers = data[1];
        this.subscribedBoth = data[2];
        this.subscribedTotal = data[0] + data[1] + data[2];
        
        this.thisRatio = (this.subscribedToThisStory / this.subscribedTotal) * 100;
        this.othersRatio = (this.subscribedToOthers / this.subscribedTotal) * 100;
        this.bothRatio = (this.subscribedBoth / this.subscribedTotal) * 100;

        this.thisRatio = Math.round(this.thisRatio * 100000) / 100000;
        this.othersRatio = Math.round(this.othersRatio * 100000) / 100000;
        this.bothRatio = Math.round(this.bothRatio * 100000) / 100000;
    }
}

@Component({
  standalone: true,
  imports: [
       RouterModule,
       CommonModule,
       FormsModule,
       ReactiveFormsModule,
       HttpClientModule
  ],
  selector: 'app-story-stats',
  templateUrl: './story-stats.component.html',
  styleUrls: ['./story-stats.component.css'],
  providers: [DataService]
})
export class StoryStatsComponent implements OnInit {
    storyId: string;
    reviewsInfo?: ReviewsInfo;
    lineInfo?: LineInfo = new LineInfo(['N/A', 'N/A', '0']);
    pieInfo?: PieInfo = new PieInfo([0, 0, 0]);

  constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) { 
    this.titleService.setTitle('Story Statistics');
    this.storyId = this.route.snapshot.params['id'];
    this.loadData();
  }

  ngOnInit() { }

  private loadData() {
    this.dataService.get<any>('story/reviews-stats/' + this.storyId, resp => {
        this.reviewsInfo = new ReviewsInfo([resp.item1, resp.item2]);
        console.log('Reviews Info:', this.reviewsInfo);
    }, error => {
        this.utils.showMessage('There was a problem fetching review stats!');
        console.log(`Error response: ${error}`);
    }, localStorage.getItem('user-token') ?? '');
    
    this.dataService.get<any>('story/line-chart/' + this.storyId, resp => {
        if (resp && resp.item2.length >= 2) {
            this.lineInfo = new LineInfo(resp.item2);
            console.log('Line Info:', this.lineInfo);
            new Chartist.Line('#chart1', {
                series: [resp.item1 as number]
            }, {
                fullWidth: true,
                chartPadding: {
                    right: 40
                }
            });
        } else {
            this.utils.showMessage('Insufficient data for line chart!');
        }
    }, error => {
        this.utils.showMessage('There was a problem fetching line chart data!');
        console.log(`Error response: ${error}`);
    }, localStorage.getItem('user-token') ?? '');
    
    this.dataService.get<number[]>('story/pie-chart/' + this.storyId, resp => {
        if (resp && resp.length === 3) {
            this.pieInfo = new PieInfo(resp);
            console.log('Pie Info:', this.pieInfo);
            new Chartist.Pie('#chart2', {
                series: resp
            }, {
                labelInterpolationFnc: () => ''
            });
        } else {
            this.utils.showMessage('Insufficient data for pie chart!');
        }
    }, error => {
        this.utils.showMessage('There was a problem fetching pie chart data!');
        console.log(`Error response: ${error}`);
    }, localStorage.getItem('user-token') ?? '');
}
}

import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var Chartist: any;

class ReviewsInfo {
    nrReviews: number;
    averageRating: number;
    constructor(data: any[]) {
        this.nrReviews = data[0];
        this.averageRating = Math.round(data[1] * 100) / 100;
    }
}

class LineInfo {
    startDate: string;
    endDate: string;
    total: string;
    constructor(data: string[]) {
        this.startDate = data[0];
        this.endDate = data[1];
        this.total = data[2];
    }
}

class PieInfo {
    subscribedToThisEvent: number;
    subscribedToOthers: number;
    subscribedBoth: number;
    subscribedTotal: number;
    thisRatio: number;
    othersRatio: number;
    bothRatio: number;
    constructor(data: number[]) {
        this.subscribedToThisEvent = data[0];
        this.subscribedToOthers = data[1];
        this.subscribedBoth = data[2];
        this.subscribedTotal = data[0] + data[1] + data[2];
        this.thisRatio = (this.subscribedToThisEvent + 0.0) / this.subscribedTotal * 100;
        this.othersRatio = (this.subscribedToOthers + 0.0) / this.subscribedTotal * 100;
        this.bothRatio = (this.subscribedBoth + 0.0) / this.subscribedTotal / 100;
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
       ReactiveFormsModule
  ],
  selector: 'app-story-stats',
  templateUrl: './story-stats.component.html',
  styleUrls: ['./story-stats.component.css']
})

export class StoryStatsComponent implements OnInit {
    storyId: string;
    reviwesInfo!: ReviewsInfo;
    lineInfo!: LineInfo;
    pieInfo!: PieInfo;

  constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) { 
    this.titleService.setTitle('Statistici eveniment');
    this.storyId = this.route.snapshot.params['id'];

    this.dataService.get<any[]>('story/reviews-stats/' + this.storyId, resp => {
        this.reviwesInfo = new ReviewsInfo(resp);
    }, error => {
        this.utils.showMessage('A apărut o problemă!');
        console.log(`Error response: ${error}`);
    }, localStorage.getItem('user-token') ?? '');

    this.dataService.get<any[]>('story/line-chart/' + this.storyId, resp => {
            this.lineInfo = new LineInfo(resp[1]);
            new Chartist.Line('#chart1', {
                    //labels: resp[1],
                    series: [
                        resp[0] as number 
                    ]
                }, {
                    fullWidth: true,
                    chartPadding: {
                        right: 40
                    }
                });
                
    }, error => {
        this.utils.showMessage('A apărut o problemă!');
        console.log(`Error response: ${error}`);
    }, localStorage.getItem('user-token') ?? '');

    this.dataService.get<number[]>('story/pie-chart/' + this.storyId, resp => {
        this.pieInfo = new PieInfo(resp);
        new Chartist.Pie('#chart2', {
            //labels: ['A', 'B', 'C'],
            series: resp
        }, {
            labelInterpolationFnc: () => {
                return ''
            }
        });
    }, error => {
        this.utils.showMessage('A apărut o problemă!');
        console.log(`Error response: ${error}`);
    }, localStorage.getItem('user-token') ?? '');
  }

  ngOnInit() {
    
  }

}

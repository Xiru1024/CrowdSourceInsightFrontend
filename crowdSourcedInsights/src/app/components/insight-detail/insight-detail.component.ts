import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-insight-detail',
  imports: [CommonModule, AccordionModule, RatingModule, FormsModule, FeedbackComponent],
  templateUrl: './insight-detail.component.html',
  styleUrl: './insight-detail.component.scss',
})
export class InsightDetailComponent implements OnInit {
  constructor(
    private http: HttpService,
    private messageService: MessageService
  ) {}

  @Input() insight: any;
  rating: number = 0;

  ngOnInit(): void {
    console.log("init");
    this.http.getInsightDetail(this.insight.id).subscribe(
      (response) => {
        this.insight = response.body;
        console.log(this.insight);
        this.rating = this.insight.rating;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load insight details.',
        });
      }
    );
  }
}

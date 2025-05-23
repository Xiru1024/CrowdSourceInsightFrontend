import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from '../feedback/feedback.component';
import { IInsight } from '../../models/models';

/**
 * InsightDetailComponent
 * ----------------------
 * This component displays detailed information about a specific insight, including its feedback and rating.
 * 
 * Main Functions:
 * - Fetches and displays detailed data for a given insight.
 * - Shows feedback and allows rating display for the insight.
 * 
 * Public Inputs:
 * - @Input() insight: IInsight | null
 *   The insight object whose details are to be displayed.
 */

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

  @Input() insight: IInsight|null = null;
  rating = 0;

  ngOnInit(): void {
    console.log("init");
    this.http.getInsightDetail(this.insight?.id??"").subscribe(
      (response) => {
        this.insight = response.body;
        console.log(this.insight);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
    );
  }
}

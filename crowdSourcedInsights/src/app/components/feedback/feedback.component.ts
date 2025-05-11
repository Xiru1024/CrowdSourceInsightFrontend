/**
 * FeedbackComponent
 * -----------------
 * This component manages the display, creation, editing, and deletion of feedback for a given insight.
 * 
 * Main Functions:
 * - Fetches and displays a list of feedback for a specific insight.
 * - Allows users to add, edit, or delete feedback.
 * - Calculates and emits the average rating for the feedback list.
 * - Handles feedback pop-up visibility and state.
 * 
 * Public Inputs:
 * - @Input() insight: IInsight | null
 *   The insight object for which feedback is being managed.
 * 
 * Public Outputs:
 * - @Output() updateAverageRating: EventEmitter<number>
 *   Emits the updated average rating whenever the feedback list changes.
 */

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FeedbackpopUpComponent } from '../feedbackpop-up/feedbackpop-up.component';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { IFeedback, IGeneral, IInsight } from '../../models/models';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-feedback',
  imports: [
    CardModule,
    FormsModule,
    ButtonModule,
    FeedbackpopUpComponent,
    CommonModule,
    RatingModule,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent implements OnInit {
  public isPopupVisible = false;
  public feedbacks: IFeedback[] = [];
  public loggedInUser: string = localStorage.getItem('username') as string;
  public isEdit = false;
  public currentFeedback: IFeedback | null = null;
  @Input() insight: IInsight | null = null;
  @Output() updateAverageRating: EventEmitter<number> =
    new EventEmitter<number>();
  constructor(
    private http: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.http.fetchFeedbacks(this.insight?.user??"", this.insight?.id??"").subscribe({
      next: (response) => {
        this.sortFBList(response);
        this.calculateAverageRating(this.feedbacks);
        console.log('feedbacks', this.feedbacks);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  public openPopup(isEdit = false) {
    this.isEdit = isEdit;
    this.isPopupVisible = true;
  }

  public closePopup(needUpdateList: boolean) {
    this.currentFeedback = null;
    if (needUpdateList) {
      this.http.fetchFeedbacks(this.insight?.user??"", this.insight?.id??"").subscribe({
        next: (response) => {
          this.sortFBList(response);
          this.calculateAverageRating(this.feedbacks);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
    }
    this.isPopupVisible = false;
  }

  editFeedback(fb: IFeedback) {
    this.currentFeedback = fb;
    this.isPopupVisible = true;
    this.isEdit = true;
    this.openPopup(true);
  }

  deleteFeedback(fb: IFeedback) {
    this.http.deleteFeedback(fb.user??"", fb.insight??"", fb.id??"").subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Feedback deleted successfully',
        });
        this.feedbacks = this.feedbacks.filter(
          (feedback) => feedback.id !== fb.id
        );
        this.calculateAverageRating(this.feedbacks);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }


  sortFBList(response: HttpResponse<IGeneral>) {
    this.feedbacks = (response?.body?.['items'] || []).sort(
      (a: IFeedback, b: IFeedback) =>
        new Date(b.created_date??0).getTime() - new Date(a.created_date??0).getTime()
    );
  }
  public calculateAverageRating(feedbacks: IFeedback[]) {
    if (feedbacks.length === 0) return;
    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + (feedback.rating ?? 0),
      0
    );
    this.updateAverageRating.emit(totalRating / feedbacks.length);
  }
}

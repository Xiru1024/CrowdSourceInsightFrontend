import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FeedbackpopUpComponent } from '../feedbackpop-up/feedbackpop-up.component';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-feedback',
  imports: [CardModule, FormsModule, ButtonModule, FeedbackpopUpComponent, CommonModule, RatingModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  public isPopupVisible: boolean = false;
  public feedbacks: any[] = [];
  public loggedInUser: string = localStorage.getItem('username') as string;
  public isEdit: boolean = false;
  public currentFeedback: any = null;
  @Input() insight: any = null;
  constructor(
    private http: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.http.fetchFeedbacks(this.insight.user, this.insight.id).subscribe({
      next: (response) => {
         this.feedbacks = (response.body.items || []).sort(
        (a: any, b: any) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
        console.log("feedbacks",this.feedbacks);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch feedbacks',
        });
      },
    });
  }

  public openPopup(isEdit: boolean = false) {
    this.isEdit = isEdit;
    this.isPopupVisible = true;
  }

  public closePopup(needUpdateList: boolean) {
    this.currentFeedback = null;
    if(needUpdateList) {
      this.http.fetchFeedbacks(this.insight.user ,this.insight.id).subscribe({
        next: (response) => {
          this.feedbacks = (response.body.items || []).sort(
            (a: any, b: any) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
          );
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch feedbacks',
          });
        },
      });
    }
    this.isPopupVisible = false;
  }

  
  editFeedback(fb: any) {
    this.currentFeedback = fb;
    this.isPopupVisible = true;
    this.isEdit = true;
    this.openPopup(true);
  }

  deleteFeedback(fb: any) {
    this.http.deleteFeedback(fb.user,fb.insight,fb.id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Feedback deleted successfully',
        });
        this.feedbacks = this.feedbacks.filter((feedback) => feedback.id !== fb.id);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete feedback',
        });
      },
    });
  }


}

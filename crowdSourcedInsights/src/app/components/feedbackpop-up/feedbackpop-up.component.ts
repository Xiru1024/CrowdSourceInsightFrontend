import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-feedbackpop-up',
  imports: [CommonModule, DialogModule, ReactiveFormsModule, RatingModule],
  templateUrl: './feedbackpop-up.component.html',
  styleUrl: './feedbackpop-up.component.scss',
})
export class FeedbackpopUpComponent {
  public feedbackForm!: FormGroup;
  @Input() insight: any= null;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      comment: [''],
      rating: [null, Validators.required],
    });
  }
  hideDialog(ifCreated = false) {
    this.onClose.emit(ifCreated);
  }

  saveFeedback() {
    if (this.feedbackForm.valid) {
      const feedbackData =  this.feedbackForm.getRawValue();
   
      this.http
        .addFeedback(
          this.insight.id,
          localStorage.getItem('username') as any,
          feedbackData
        )
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Feedback submitted successfully',
            });
            this.hideDialog(true);
          },
          error: (error) => {
            console.error('Error submitting feedback:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to submit feedback',
            });
          },
        });
    }
  }
}

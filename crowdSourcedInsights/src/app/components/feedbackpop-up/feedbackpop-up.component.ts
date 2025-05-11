import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
import { IFeedback, IInsight } from '../../models/models';

/**
 * FeedbackpopUpComponent
 * ----------------------
 * This component provides a dialog for users to submit or edit feedback for a specific insight.
 * 
 * Main Functions:
 * - Displays a form for feedback submission or editing.
 * - Handles form validation and submission to the backend.
 * - Emits events to close the dialog and notify parent components of changes.
 * 
 * Public Inputs:
 * - @Input() insight: IInsight | null
 *   The insight for which feedback is being provided.
 * - @Input() currentFeedback: IFeedback | null
 *   The feedback object to edit (if in edit mode).
 * - @Input() isEdit: boolean
 *   Flag to indicate if the dialog is in edit mode.
 * 
 * Public Outputs:
 * - @Output() closeFeedback: EventEmitter<boolean>
 *   Emits when the dialog is closed, with a boolean indicating if feedback was created/updated.
 */

@Component({
  selector: 'app-feedbackpop-up',
  imports: [CommonModule, DialogModule, ReactiveFormsModule, RatingModule],
  templateUrl: './feedbackpop-up.component.html',
  styleUrl: './feedbackpop-up.component.scss',
})
export class FeedbackpopUpComponent implements OnInit {
  public feedbackForm!: FormGroup;
  @Input() insight: IInsight|null = null;
  @Input() currentFeedback: IFeedback | null = null;
  @Input() isEdit = false;
  @Output() closeFeedback: EventEmitter<boolean> = new EventEmitter<boolean>();
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

    if (this.isEdit) {
      this.feedbackForm.patchValue(this.currentFeedback??{});
    }
  }
  hideDialog(ifCreated = false) {
    this.closeFeedback.emit(ifCreated);
  }

  saveFeedback() {
    if (this.feedbackForm.valid) {
      const feedbackData = this.feedbackForm.getRawValue();
      if (this.isEdit) {
        this.http
          .updateFeedback(
            this.currentFeedback?.user||"",
            this.currentFeedback?.insight||"",
            this.currentFeedback?.id||"",
            feedbackData
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Feedback updated successfully',
              });
              this.closeFeedback.emit(true);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
            },
          });
      } else {
        this.http
          .addFeedback(
            this.insight?.id||"",
            localStorage.getItem('username') as string,
            feedbackData
          )
          .subscribe({
            next: () => {
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
                detail: error.message,
              });
            },
          });
      }
    }
  }
}

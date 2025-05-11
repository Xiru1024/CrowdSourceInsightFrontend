import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { IInsight } from '../../models/models';

@Component({
  selector: 'app-insight-creation-pop',
  imports: [DialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './insight-creation-pop.component.html',
  styleUrl: './insight-creation-pop.component.scss',
})
export class InsightCreationPopComponent implements OnInit {
  @Input() lat_long!: {
    latitude?: number;
    longitude?: number;
  };
  @Input() isEdit = false;
  @Input() insight: IInsight|null = null;
  @Output() panelClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  public dialogData: IInsight = {};

  public insightForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Initialize the form with default values
    this.insightForm = this.fb.group({
      title: ['', Validators.required], // Required field
      address: [''],
      category: [''],
      subcategory: [''],
      description: [''],
      external_link: [''],
      image: [''],
      latitude: [
        { value: this.lat_long?.latitude ?? null, disabled: true },
        Validators.required,
      ],
      longitude: [
        { value: this.lat_long?.longitude ?? null, disabled: true },
        Validators.required,
      ],
    });
    console.log('isEdit: ', this.isEdit);

    if (this.isEdit) {
      this.http.getInsightDetail(this.insight?.id??"").subscribe({
        next: (response) => {
          this.dialogData = response.body as IInsight;
          this.insightForm.patchValue({
            title: this.dialogData.title,
            address: this.dialogData.address,
            category: this.dialogData.category,
            subcategory: this.dialogData.subcategory,
            description: this.dialogData.description,
            external_link: this.dialogData.external_link,
            image: this.dialogData.image,
            latitude: this.dialogData.latitude,
            longitude: this.dialogData.longitude,
          });
          this.insightForm.markAsPristine();
          this.insightForm.markAsUntouched();
          this.insightForm.updateValueAndValidity();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
          console.error('Error fetching insight:', error);
        },
      });
    }
  }

  hideDialog(ifCreated = false) {
    this.panelClose.emit(ifCreated);
  }

  saveInsight() {
    console.log('Form Data:', this.insightForm.getRawValue());
    const payload = {
      ...this.insightForm.getRawValue(),
      id: this.insight?.id,
      user: localStorage.getItem('username'),
    };

    if (this.insightForm.valid) {
      if (this.isEdit) {
        this.http.updateInsight(payload).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Updated successfully',
            });
            this.insightForm.reset();
            this.hideDialog(true);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
            console.error('Error updating insight:', error);
            this.dialogData = error;
          },
        });
      } else {
        this.http.createInsight(payload).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Saved successfully',
            });
            this.insightForm.reset();
            this.hideDialog(true);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
            console.error('Error creating insight:', error);
            this.dialogData = error;
          },
        });
      }
    } else {
      this.insightForm.markAllAsTouched();
    }
  }
}

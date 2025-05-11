import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-insight-creation-pop',
  imports: [DialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './insight-creation-pop.component.html',
  styleUrl: './insight-creation-pop.component.scss'
})
export class InsightCreationPopComponent {

  @Input() lat_long: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  public dialogData: any = {}; 

  public insightForm!: FormGroup;
  constructor(private fb: FormBuilder,
      private http: HttpService, 
      private messageService: MessageService,
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
      latitude: [{ value: this.lat_long?.latitude, disabled: true }, Validators.required],
      longitude: [{ value: this.lat_long?.longitude, disabled: true }, Validators.required], 
    });
  }



  hideDialog(ifCreated= false) {
    this.onClose.emit(ifCreated);
  }

  saveInsight() {
   if (this.insightForm.valid) {
      console.log('Form Data:', this.insightForm.getRawValue()); 
      const payload = {
        ...this.insightForm.getRawValue(),
        user: localStorage.getItem('username'),
      }
      this.http.createInsight(payload).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved successfully' });
          console.log("response: ",response);
          this.dialogData = response;
          this.insightForm.reset();
          this.hideDialog(true);
        }
        , error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Save failed'});
          console.error('Error creating insight:', error);
          this.dialogData = error;
        }
      });

    } else {
      this.insightForm.markAllAsTouched();
    }
  }

}

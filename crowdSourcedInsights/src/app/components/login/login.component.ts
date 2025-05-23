/**
 * LoginComponent
 * --------------
 * This component provides a user registration and login form.
 * 
 * Main Functions:
 * - Displays a form for user registration/login.
 * - Validates user input and submits registration data to the backend.
 * - Handles success and error responses, storing credentials and navigating to the map on success.
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/httpService';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.loginForm =  this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: [''],
      password: ['', Validators.required],
      username: ['', Validators.required]
    });
  }
  
public onSubmit() {

 if (this.loginForm.valid) {
    console.log(this.loginForm.value);
    this.http.createUser(this.loginForm.value).subscribe({
        next: (response) => {
          console.log("response: ",response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved successfully' });

           localStorage.setItem('api_key', response?.body?.["api_key"]);
           localStorage.setItem('username', this.loginForm.get('username')?.value);
           this.router.navigate(['/map']);

        },
        error: (error) => {
          console.error('Error registering user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail:error.message });

        }
    })

   
  } else {
   this.loginForm.markAllAsTouched()
  }
}


}

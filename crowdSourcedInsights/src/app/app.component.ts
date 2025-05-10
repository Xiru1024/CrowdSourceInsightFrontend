import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  providers: [MessageService],
  imports: [ LoginComponent,  ToastModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'crowdSourcedInsights';
}

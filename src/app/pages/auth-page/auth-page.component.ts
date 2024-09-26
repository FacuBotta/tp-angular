import { Component } from '@angular/core';
import { FormComponent } from '../../components/log-form/log-form.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {}

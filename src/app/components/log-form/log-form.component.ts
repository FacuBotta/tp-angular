import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PopupErrorDirective } from '../../directives/popup-error.directive';
import { PassValidatorDirective } from '../../directives/auth/pass-validator.directive';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupErrorDirective,
    PassValidatorDirective,
  ],
  templateUrl: './log-form.component.html',
  styleUrl: './log-form.component.css',
})
export class FormComponent {
  constructor(private authService: AuthService) {}

  isLogIn: boolean = false;

  router = inject(Router);

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  username = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.maxLength(15),
    Validators.minLength(6),
  ]);
  rePassword = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
  ]);
  // Méthode qui permet de basculer la visibilité du champ de mot de passe
  toggleVisibility(id: 'password' | 'confirm-password'): void {
    const passElement: HTMLInputElement | null = document.getElementById(
      id
    ) as HTMLInputElement;

    if (id === 'password') {
      this.passwordVisible = !this.passwordVisible;
      if (this.passwordVisible) {
        passElement.type = 'text';
      } else {
        passElement.type = 'password';
      }
    } else if (id === 'confirm-password') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
      if (this.confirmPasswordVisible) {
        passElement.type = 'text';
      } else {
        passElement.type = 'password';
      }
    }
  }

  // Cet attribut permet de basculer entre les deux formulaires 'login' et 'register'
  toggleForm() {
    this.isLogIn = !this.isLogIn;
  }

  // Méthode qui utilise le formulaire pour s'inscrire
  submitSignUp() {
    if (this.username.invalid || this.email.invalid || this.password.invalid) {
      // ici il faut affiche un modal d'erreur si un des champs n'est pas valide
      console.log('invalid field');
    } else {
      const email = this.email.value as string;
      const password = this.password.value as string;
      const username = this.username.value as string;
      // Utilisation du service AuthService pour s'inscrire
      // On doit se subscribe a la méthode car elle est un Observable
      this.authService.register(email, password, username).subscribe(
        () => {
          console.log('User registered');
        },
        (error) => {
          console.error('Error registering user:', error);
        }
      );
    }
  }

  // Méthode qui utilise le formulaire pour se connecter
  submitLogIn() {
    if (this.email.invalid || this.password.invalid) {
      // ici il faut affiche un modal d'erreur si un des champs n'est pas valide
      console.log('invalid field');
    } else {
      const email = this.email.value as string;
      const password = this.password.value as string;
      // Utilisation du service AuthService pour se connecter
      // On doit se subscribe a la méthode car elle est un Observable
      this.authService.login(email, password).subscribe(
        () => {
          console.log('User logged in');
        },
        (error) => {
          console.error('Error logging in:', error);
        }
      );
    }
  }
}

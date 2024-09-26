import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  router = inject(Router);
  // On import le service AuthService
  authService = inject(AuthService);

  // user$ contient tout ce qui est stocké dans firebase pour sa compte
  user$ = this.authService.user$;

  username: string = '';
  email: string = '';

  // Articles du utilisateur courant qui seront stockés dans user$
  // articles = [];

  constructor() {
    // On subscribe à user$ pour récupérer les données de l'utilisateur courant
    this.user$.subscribe((user: any) => {
      if (user) {
        this.username = user.displayName;
        this.email = user.email;
      } else {
        // Si l'utilisateur n'est pas connecté, on redirige vers la page d'accueil
        // comme ca on protege la route /profile
        this.router.navigateByUrl('/');
      }
    });
  }
  logout() {
    // On déconnecte l'utilisateur avec la méthode logout du service AuthService
    this.authService.logout();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { ArticleServiceService } from '../../article-service.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  router = inject(Router);
  modalOpen: boolean = false;
  articleModal: boolean = false;
  // On import le service AuthService
  authService = inject(AuthService);
  articlesService = inject(ArticleServiceService);
  valuesArticle: any = [];
  // var form
  id: string = '';
  title: string = '';
  subtitle: string = '';
  description: string = '';
  content: string = '';
  online: boolean = false;
  values: any = [];

  // On import le service ProfileService
  profileService = inject(ProfileService);
  allUsers$ = this.profileService.allUsers$;
  currentUser$ = this.profileService.currentUser$;
  userFriends: any[] = [];
  friendsIds: string[] = [];

  userArticles: any[] = [];

  // user$ contient tout ce qui est stocké dans firebase pour sa compte
  user$ = this.authService.user$;

  username: string = '';
  email: string = '';
  userImage: string = '';

  modalUsername: string = '';
  modalImageUrl: string = '';

  constructor() {
    this.profileService.allUsers$.subscribe((users) => {
      this.profileService.currentUser$.subscribe((user) => {
        if (user && user.friends) {
          this.userFriends = users.filter((u) => user.friends.includes(u.id));
          this.friendsIds = user.friends;
          console.log(user);
        }
      });
    });

    this.profileService.userArticles$.subscribe((articles) => {
      this.userArticles = articles;
    });
    // On subscribe à user$ pour récupérer les données de l'utilisateur courant
    this.user$.subscribe((user: any) => {
      if (user) {
        this.username = user.displayName;
        this.email = user.email;
        if (user.photoURL) {
          this.userImage = user.photoURL;
        } else {
          this.userImage =
            'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg';
        }
      } else {
        // Si l'utilisateur n'est pas connecté, on redirige vers la page d'accueil
        // comme ca on protege la route /profile
        this.router.navigateByUrl('/');
      }
    });
  }

  toggleModal() {
    this.modalOpen = !this.modalOpen;
    if (!this.modalOpen) {
      this.modalImageUrl = '';
      this.modalUsername = '';
    }
  }
  editProfile() {
    if (this.modalUsername !== '' && this.modalImageUrl !== '') {
      this.authService
        .editProfile(this.modalUsername, this.modalImageUrl)
        .subscribe({
          next: () => {
            console.log('Profile updated successfully!');
            this.toggleModal();
          },
          error: (err) => {
            console.error('Error updating profile:', err);
          },
        });
    } else {
      console.error('Username or Image URL is missing.');
    }
  }
  logout() {
    // On déconnecte l'utilisateur avec la méthode logout du service AuthService
    this.authService.logout();
  }

  addFriend(id: string) {
    if (id) {
      this.profileService.addFriend(id).subscribe({
        next: () => {
          console.log('friend add successfully');
        },
        error: (error) => {
          console.error('Error adding friend:', error);
        },
      });
    }
  }
  removeFriend(id: string) {
    if (id) {
      this.profileService.removeFriend(id).subscribe({
        next: () => {
          console.log('friend delete successfully');
        },
        error: (error) => {
          console.error('Error deleting friend:', error);
        },
      });
    }
  }

  editArticle(id: number) {
    // this.valuesArticle = this.articlesService.getArticle(id);
    // Affect values
    this.id = this.valuesArticle.id;
    this.title = this.valuesArticle.title;
    this.subtitle = this.valuesArticle.subtitle;
    this.description = this.valuesArticle.description;
    this.content = this.valuesArticle.content;
    this.online = this.valuesArticle.online;
  }
  save(id: number) {
    this.values = [
      {
        id: this.id,
        title: this.title,
        subtitle: this.subtitle,
        description: this.description,
        content: this.content,
        online: this.online,
      },
    ];
    // this.articlesService.updateArticle(id, this.values[0]);
  }
}

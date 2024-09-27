import { inject, Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { Auth, signOut, updateProfile, user } from '@angular/fire/auth';
import { UserInterface } from '../types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  // cette variable contient tout ce qui est stocké dans firebase pour l'utilisateur courant
  user$ = user(this.auth);

  // cette signal est utilisée pour conditioner certaines elements du DOM, par exemple les liens du nav
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);

  router = inject(Router);

  // Cette méthode permet de créer un utilisateur dans firebase
  register(
    email: string,
    password: string,
    username: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
      .then((response) =>
        updateProfile(response.user, { displayName: username })
      )
      .then(() => {
        // Si tout est ok, on set la signal et on redirige vers la page de profile
        this.currentUserSignal.set({
          email,
          username,
        });
        this.router.navigateByUrl('/profile');
      })
      .catch((error: any) => {
        throw error;
      });
    return from(promise);
  }
  // Cette méthode permet de se connecter à un utilisateur
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.user$.subscribe((firebaseUser: any) => {
          // On set la signal et on redirige vers la page de profile
          if (firebaseUser) {
            this.currentUserSignal.set({
              email: firebaseUser.email!,
              username: firebaseUser.displayName || '',
            });
          }
        });
        this.router.navigateByUrl('/profile');
      })
      .catch((error) => {
        throw error;
      });
    return from(promise);
  }
  // Cette méthode permet de se déconnecter
  logout(): Observable<void> {
    const promise = signOut(this.auth).then(() => {
      // On set la signal a null et on redirige vers la page d'accueil
      this.currentUserSignal.set(null);
      this.router.navigateByUrl('/');
    });
    return from(promise);
  }
  // Cette méthode permet de editer le profil de l'utilisateur
  editProfile(username: string, imageUrl: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No user is currently logged in.');
    }
    const promise = updateProfile(user, {
      displayName: username,
      photoURL: imageUrl,
    })
      .then(() => {
        this.currentUserSignal.set({
          email: user.email!,
          username,
        });
      })
      .catch((error) => {
        throw error;
      });

    return from(promise);
  }
}

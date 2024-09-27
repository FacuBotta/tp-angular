import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User } from '@angular/fire/auth';
import {
  arrayRemove,
  arrayUnion,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private firestore: Firestore = inject(Firestore);
  authService = inject(AuthService);

  user$: Observable<User | null> = this.authService.user$;

  currentUser$: Observable<any | null>;
  userArticles$: Observable<any[]>;

  allUsers$: Observable<any[]>;

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.allUsers$ = collectionData(usersCollection, {
      idField: 'id',
    }) as Observable<any[]>;
    this.userArticles$ = this.user$.pipe(
      switchMap((user) => {
        if (user && user.uid) {
          // Referencia a la colección 'articles'
          const articlesRef = collection(this.firestore, 'articles');
          // Filtramos los artículos por el uid del usuario
          const userArticlesQuery = query(
            articlesRef,
            where('userId', '==', user.uid)
          );
          return collectionData(userArticlesQuery, { idField: 'id' });
        } else {
          return of([]); // Si no hay usuario logueado, retorna un array vacío
        }
      })
    );

    this.currentUser$ = this.user$.pipe(
      switchMap((user) => {
        if (user && user.uid) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          return docData(userDocRef, { idField: 'id' });
        } else {
          return of(null);
        }
      })
    );
  }

  addFriend(friendId: string): Observable<void> {
    return this.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user || !user.uid) {
          throw new Error('No user is currently logged in.');
        }
        const userDocRef = doc(this.firestore, `users/${user.uid}`);

        const promise = updateDoc(userDocRef, {
          friends: arrayUnion(friendId),
        });
        return from(promise);
      })
    );
  }
  removeFriend(friendId: string): Observable<void> {
    return this.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user || !user.uid) {
          throw new Error('No user is currently logged in.');
        }
        const userDocRef = doc(this.firestore, `users/${user.uid}`);

        // Aquí usamos arrayRemove para eliminar el friendId del array de amigos
        const promise = updateDoc(userDocRef, {
          friends: arrayRemove(friendId), // Elimina friendId del array de amigos
        });

        return from(promise);
      })
    );
  }
}

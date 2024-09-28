import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  Firestore,
  getDoc,
  docData,
} from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { query, updateDoc, where } from 'firebase/firestore';
import { AuthService } from './services/auth.service';
import { User } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class ArticleServiceService {
  articleSelected: any;
  private firestore: Firestore = inject(Firestore);
  authService = inject(AuthService);
  articles$: Observable<any[]>;
  allUsers$: Observable<any[]>;

  user$: Observable<User | null> = this.authService.user$;

  constructor(){
    const usersCollection = collection(this.firestore, 'users');
    this.allUsers$ = collectionData(usersCollection, {
      idField: 'id',
    }) as Observable<any[]>;

    this.articles$ = this.user$.pipe(
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
          return of([]);
        }
      })
    );
    
  }
  articleFilterquery:any;
  // FILTER METHODS
  filterOnline(userId:string, type:string): Observable<any[]>{
    const articlesCollection = collection(this.firestore, 'articles');
    if(type === 'online'){
      this.articleFilterquery = query(articlesCollection, where('online', "==", true), 
      where('userId', '==', userId));     
    }else if(type === 'offline'){
      this.articleFilterquery = query(articlesCollection, where('online', "==", false), 
      where('userId', '==', userId));  
    }  
    return collectionData(this.articleFilterquery, { idField: 'id' }) as Observable<any[]>;  
  }

  add(title: string, subtitle: string, description: string, content: string, userName: string, userId: string, online: boolean) 
  {
    const articlesCollection = collection(this.firestore, 'articles');
    return addDoc(articlesCollection, {
    title,
    subtitle,
    description,
    content,
    userName,
    userId,
    online
    });
  }
  // Get one article
  get(id:number){
    const articleIdString = id.toString();
    const articleDocRef = doc(this.firestore, 'articles', articleIdString); 

    return docData(articleDocRef);    
  }
  // Save an article
  update(id:number, articleArray:any){
    const articleIdString = id.toString();
    const articleDocRef = doc(this.firestore, 'articles', articleIdString); 
    return from(updateDoc(articleDocRef, articleArray));
  }

  delete(id:number){
    const articleIdString = id.toString();
    const articleDocRef = doc(this.firestore, 'articles', articleIdString);
    return from(deleteDoc(articleDocRef));
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ArticleServiceService } from '../../article-service.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ArticleInterface } from '../../types';
import { ProfileService } from '../../services/profile.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.css'
})
export class ArticlesPageComponent {
  profileService = inject(ProfileService);
  pageTitle = 'Mes articles';
  list_articles:any = [];
  valuesArticle:any = [];
  values:any = [];
  isHovered:boolean = false;
  articles$: Observable<any[]> = of([])
  articles: ArticleInterface[] = [];
  article:any;  
  displayModal:boolean = false;
  displayAddModal:boolean = false;
  displayConfirmModal:boolean = false;
  // get current user
  currentUser$ = this.profileService.currentUser$;
  userId:string = '';
  userName:string = '';
  success:string = '';
  error:string = '';
  isClicked: any;

  // var form
  id:string = '';
  title:string = '';
  subtitle:string = '';
  description:string = '';
  content:string = '';
  online:boolean = false;
  like:number = 0;

  constructor(private articlesService: ArticleServiceService){
    this.profileService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;  
        this.userName = user.username;  
        // this.articlesService.articles$ = this.articlesService.getAllArticles(user.uid);      
        this.articlesService.articles$.subscribe((articles) => {
          this.articles = articles;          
        });
      }
    })
  }
  // CRUD Articles
  addArticles(){ 
    this.success = '';
    this.error = '';
    this.articlesService.add(this.title, this.subtitle, this.description, this.content, this.userName, this.userId, this.online).then(() => {
      this.success = 'Article bien ajouté !';
    })
    .catch((error: any) => {
      this.error = "Impossible d'ajouter' l'article =/";   
    });
  }

  editArticle(id:string){
    // empty messages
    this.success = '';
    this.error = '';
    this.article = this.articlesService.get(id).subscribe(
        (data:any) => {
          this.valuesArticle = data;
          this.id = id;
          this.title = this.valuesArticle.title;
          this.subtitle = this.valuesArticle.subtitle;
          this.description = this.valuesArticle.description;
          this.content = this.valuesArticle.content;
          this.online = this.valuesArticle.online;  
        }
    );  
  }
  save(id:string){
    this.values = [{id : id, title : this.title, subtitle : this.subtitle, description: this.description, content : this.content, online : this.online}];    
    this.articlesService.update(id, this.values[0]).subscribe({
      next: () => {
        this.success = 'Article bien mis à jour';         
      },
      error: () =>{
        this.error = 'Impossible de mettre à jour l\'article =/';         
      }
    })
  }
  getArticleId(id:string){
    return this.id = id;
  }
  deleteArticle(id:string){    
    this.articlesService.delete(id).subscribe({
      next: () => {
        this.success = 'Article bien supprimé';         
      },
      error: () =>{
        this.error = 'Impossible de supprimer l\'article =/';
      }
    })
  }
  likeArticle(id:string){
    this.articlesService.addLike(id).subscribe({
        next: () => {
         console.log('Article bien liké');     
        },
        error: () =>{
          console.error('Impossible de liker l\'article =/');
        }
      }
    )
  }
  // FILTER METHODS
  filterArticle(userId:string, type:boolean){
      this.articlesService.filterOnline(userId, type).subscribe(
      (articles) => this.articles = articles
      ); 
  }
  deleteFilter(){
    this.articlesService.articles$.subscribe((articles) => {
      this.articles = articles;          
    });
  }

}

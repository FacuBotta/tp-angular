import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
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
export class ArticlesPageComponent implements OnInit{
  profileService = inject(ProfileService);
  pageTitle = 'Liste des articles';
  list_articles:any = [];
  valuesArticle:any = [];
  values:any = [];
  isHovered:boolean = false;
  articles$: Observable<ArticleInterface[]>;
  articles: ArticleInterface[] = [];
  article:any;  
  displayModal:boolean = false;
  displayAddModal:boolean = false;
  displayConfirmModal:boolean = false;
  // get current user
  currentUser$ = this.profileService.currentUser$;
  userId:string = '';
  userName:string = '';
  success:string = 'Succes';
  error:string = 'Erreur';

  // var form
  id:number = 0;
  title:string = '';
  subtitle:string = '';
  description:string = '';
  content:string = '';
  online:boolean = false;

  constructor(private articlesService: ArticleServiceService){
    this.articles$ = this.articlesService.articles$;
    this.profileService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;  
        this.userName = user.username;  
      }
    })
  }

  ngOnInit(): void {
    this.articles$.subscribe((articles) => {
      this.articles = articles;     
    });
  }
  addArticles(){ 
    this.articlesService.add(this.title, this.subtitle, this.description, this.content, this.userName, this.userId, this.online).then(() => {
      this.success = 'Article bien ajouté !';
    })
    .catch((error: any) => {
      this.error = "Impossible d'ajouter' l'article =/";        

    });
  }
  editArticle(id:number){
    this.article = this.articlesService.get(id).subscribe(
      (data:any) => {
        this.valuesArticle = data;
        this.id = id;
        this.title = this.valuesArticle.title;
        this.subtitle = this.valuesArticle.subtitle;
        this.description = this.valuesArticle.description;
        this.content = this.valuesArticle.content;
        this.online = this.valuesArticle.online;    
        console.log(this.online);

      }
    );
    
    // Affect values
  }
  save(id:number){
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
  deleteArticle(id:number){
    this.articlesService.delete(id).subscribe({
      next: () => {
        this.success = 'Article bien supprimé';         
      },
      error: () =>{
        this.error = 'Impossible de supprimer l\'article =/';
      }
    })
  }
}

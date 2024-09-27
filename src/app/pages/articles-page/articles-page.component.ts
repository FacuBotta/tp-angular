import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { ArticleServiceService } from '../../article-service.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ArticleInterface } from '../../types';

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.css'
})
export class ArticlesPageComponent implements OnInit{
  pageTitle = 'Liste des articles';
  list_articles:any = [];
  displayModal:boolean = false;
  valuesArticle:any = [];
  values:any = [];
  isHovered:boolean = false;
  articles$: Observable<ArticleInterface[]>;
  articles: ArticleInterface[] = [];

  // var form
  id:number = 0;
  title:string = '';
  subtitle:string = '';
  description:string = '';
  content:string = '';
  online:boolean = false;

  constructor(private articlesService: ArticleServiceService){
    this.articles$ = this.articlesService.articles$;
  }

  ngOnInit(): void {
    this.articles$.subscribe((articles) => {
      this.articles = articles;
      console.log(articles);      
    });
  }
  editArticle(id:number){
    this.valuesArticle = this.articlesService.getArticle(id);  
    // Affect values
    this.id = this.valuesArticle.id;
    this.title = this.valuesArticle.title;
    this.subtitle = this.valuesArticle.subtitle;
    this.description = this.valuesArticle.description;
    this.content = this.valuesArticle.content;
    this.online = this.valuesArticle.online;
  }
  // save(id:number){
  //   this.values = [{id : this.id, title : this.title, subtitle : this.subtitle, description: this.description, content : this.content, online : this.online}];    
  //   this.articles.updateArticle(id, this.values[0])
  // }
}

import { Component, effect } from '@angular/core';
import { ArticleServiceService } from '../../article-service.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.css'
})
export class ArticlesPageComponent {
  pageTitle = 'Liste des articles';
  list_articles:any = [];
  displayModal:boolean = false;
  valuesArticle:any = [];
  values:any = [];
  isHovered:boolean = false;
  allArticles: any[] = [];

  // var form
  id:number = 0;
  title:string = '';
  subtitle:string = '';
  description:string = '';
  content:string = '';
  online:boolean = false;

  constructor(private articles: ArticleServiceService){
    this.articles.getArticles().subscribe((allArticles) => {
      this.allArticles = allArticles;
    });
    effect(() => {
      this.list_articles = this.articles.getArticles();
    })
  }
  editArticle(id:number){
    this.valuesArticle = this.articles.getArticle(id);  
    // Affect values
    this.id = this.valuesArticle.id;
    this.title = this.valuesArticle.title;
    this.subtitle = this.valuesArticle.subtitle;
    this.description = this.valuesArticle.description;
    this.content = this.valuesArticle.content;
    this.online = this.valuesArticle.online;
  }
  save(id:number){
    this.values = [{id : this.id, title : this.title, subtitle : this.subtitle, description: this.description, content : this.content, online : this.online}];    
    this.articles.updateArticle(id, this.values[0])
  }
}

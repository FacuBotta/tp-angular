import { inject, Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


interface Articles {
  id:number,
  title:string,
  subtitle:string,
  description:string,
  content:string,
  authorName:string,
  authorId:number,
  online:boolean
}
@Injectable({
  providedIn: 'root'
})
export class ArticleServiceService {
  private firestore = inject(AngularFirestore);
  articleSelected:any = [];

  public articles = signal<Articles[]> (
  [
      {
        id: 1,
        title: "10 Conseils pour Réussir Votre Entretien d'Embauche",
        subtitle: "Les astuces indispensables pour se démarquer",
        description:"Dans cet article, nous allons explorer 10 conseils pratiques pour réussir vos entretiens d'embauche.",
        content: `Dans cet article, nous allons explorer 10 conseils pratiques pour réussir vos entretiens d'embauche. 
        Qu'il s'agisse de la préparation, de la gestion du stress ou des questions fréquentes, ces astuces vous aideront 
        à maximiser vos chances de décrocher le poste que vous souhaitez.`,
        authorName: "Facundo",
        authorId: 1,
        online: true
      },
      {
        id: 2,
        title: "Comment Rédiger un CV qui Attire l'Attention",
        subtitle: "Les éléments essentiels pour un CV percutant",
        description:"Votre CV est souvent la première impression que vous faites sur un employeur.",
        content: `Votre CV est souvent la première impression que vous faites sur un employeur. Dans cet article, 
        nous vous donnons des astuces pour rendre votre CV unique, bien structuré et adapté aux attentes des recruteurs.`,
        authorName: "Facundo",
        authorId: 1,
        online: true
      },
      {
        id: 3,
        title: "Les Erreurs à Éviter lors de la Recherche d'Emploi",
        subtitle: "Apprenez à éviter les pièges courants",
        description: "Dans cet article, nous passons en revue les erreurs les plus fréquentes commises par les candidats",
        content: `Dans cet article, nous passons en revue les erreurs les plus fréquentes commises par les candidats 
        lors de leur recherche d'emploi, que ce soit dans la rédaction du CV, les lettres de motivation, ou lors des entretiens.`,
        authorName: "David",
        authorId: 2,
        online: false
      },
      {
        id: 4,
        title: "Optimiser Votre Profil LinkedIn pour les Recruteurs",
        subtitle: "Augmentez votre visibilité sur LinkedIn",
        description: "Description de l'article",
        content: `LinkedIn est un outil incontournable pour la recherche d'emploi. Apprenez à optimiser votre profil 
        pour attirer l'attention des recruteurs et mettre en avant vos compétences.`,
        authorName: "David",
        authorId: 2,
        online: true
      },
      {
        id: 5,
        title: "Préparer une Lettre de Motivation Efficace",
        subtitle: "Personnalisez chaque lettre pour maximiser l'impact",
        description: "Description de l'article",
        content: `La lettre de motivation est un document clé pour montrer votre motivation et votre adéquation avec le poste. 
        Dans cet article, découvrez comment rédiger une lettre impactante et adaptée à chaque offre d'emploi.`,
        authorName: "Julie",
        authorId: 3,
        online: true
      },
      {
        id: 6,
        title: "Préparer une Lettre de Motivation Efficace",
        subtitle: "Personnalisez chaque lettre pour maximiser l'impact",
        description: "Description de l'article",
        content: `La lettre de motivation est un document clé pour montrer votre motivation et votre adéquation avec le poste. 
        Dans cet article, découvrez comment rédiger une lettre impactante et adaptée à chaque offre d'emploi.`,
        authorName: "Julie",
        authorId: 3,
        online: false
      }
  ])
  // Get all articles
  
  getArticles(): Observable<any>{
    return this.firestore.collection('articles').get();
  }
  // Get one article
  getArticle(id:number){
    this.articleSelected = this.articles()[id];
    return this.articleSelected 
  }
  // Save an article
  updateArticle(id:number, articleArray:any){
    this.articles.update( articles => 
      articles.map( (article:any) => 
        article.id === id ? { ...article, 
          title: articleArray.title,
          subtitle: articleArray.subtitle,
          description: articleArray.description,
          content: articleArray.content,
          online: articleArray.online,
        } : article
      )
    ) 
  }

}

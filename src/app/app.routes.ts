import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ArticlesPageComponent } from './pages/articles-page/articles-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { MessageriePageComponent } from './pages/messagerie-page/messagerie-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'articles', component: ArticlesPageComponent },
  { path: 'messagerie', component: MessageriePageComponent },
  { path: '**', redirectTo: '' },
];

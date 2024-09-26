import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ArticlesPageComponent } from './pages/articles-page/articles-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'articles', component: ArticlesPageComponent },
  { path: '**', redirectTo: '' },
];

import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  // ici un verification de l'existence de l'utilisateur
  // cette verification sera faite par toutes les pages car app.component.ts est appelé par toutes les pages
  // comme ca, on peut utiliser la signal pour determiner quelles liens montrer dans le navbar
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.authService.currentUserSignal.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }
}

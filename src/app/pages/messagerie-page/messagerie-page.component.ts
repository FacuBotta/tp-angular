import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { ChatService } from '../../services/messages.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { messageType } from '../../types';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-messagerie-page',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './messagerie-page.component.html',
  styleUrls: ['./messagerie-page.component.css'],
})
export class MessageriePageComponent implements OnInit {
  modalOpen: boolean = false;

  newMessage: string = '';

  messages$: Observable<messageType[]> = of([]);
  messages: messageType[] = [];
  userFriends: any[] = [];
  authService = inject(AuthService);
  participants: string[] = [];

  conversations$: Observable<any[]> = of([]);
  currentConversation = signal<any>(null);

  // On import le service ProfileService
  profileService = inject(ProfileService);

  currentUser$ = this.profileService.currentUser$;
  currentUser: any;
  allUsers$ = this.profileService.allUsers$;
  allUsers: any[] = [];

  constructor(private chatService: ChatService) {
    effect(() => {
      const conversationId = this.currentConversation()?.id;
      if (conversationId) {
        this.messages$ =
          this.chatService.getMessagesByConversation(conversationId);
      }
    });
  }

  ngOnInit(): void {
    this.profileService.allUsers$.subscribe((users) => {
      this.profileService.currentUser$.subscribe((user) => {
        if (user && user.friends) {
          this.conversations$ = this.chatService.getAllConversations(user.uid);
          this.currentUser = user;
          this.userFriends = users.filter((u) => user.friends.includes(u.id));

          this.conversations$.subscribe((conversations) => {
            if (conversations.length > 0) {
              this.currentConversation.set(conversations[0]);
            }
          });
        }
      });
    });
  }

  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }
  createConversation() {
    this.chatService.createConversation(this.currentUser.id, this.participants);
  }
  deleteConversation(id: string) {
    this.chatService.deleteConversation(id).subscribe({
      next: () => {
        console.log('Conversation deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting conversation:', error);
      },
    });
  }

  sendMessage(content: string, user: string) {
    if (content.trim().length > 0) {
      this.chatService
        .sendMessage(content, user, this.currentConversation().id)
        .then(() => {
          this.newMessage = '';
        });
    }
  }
}

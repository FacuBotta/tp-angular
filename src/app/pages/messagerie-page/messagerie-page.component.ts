import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../services/messages.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { messageType } from '../../types';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messagerie-page',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './messagerie-page.component.html',
  styleUrls: ['./messagerie-page.component.css'],
})
export class MessageriePageComponent implements OnInit {
  newMessage: string = '';
  messages$: Observable<messageType[]>;
  authService = inject(AuthService);

  messages: messageType[] = [];

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
  }

  ngOnInit(): void {
    this.messages$.subscribe((messages) => {
      this.messages = messages;
    });
    console.log(this.authService.currentUserSignal());
  }

  sendMessage(content: string, user: string) {
    if (content.trim().length > 0) {
      this.chatService.sendMessage(content, user).then(() => {
        this.newMessage = '';
      });
    }
  }

  clearMessages() {
    this.chatService
      .deleteAllMessages()
      .then(() => {
        console.log('Messages deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting messages:', error);
      });
  }
}
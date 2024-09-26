import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/messages.service';
import { NgFor, NgIf } from '@angular/common'; // Agregar para usar directivas de Angular
import { FormsModule } from '@angular/forms'; // Para el uso de [(ngModel)]

@Component({
  selector: 'app-messagerie-page',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule], // Importar NgFor, NgIf, FormsModule
  templateUrl: './messagerie-page.component.html',
  styleUrls: ['./messagerie-page.component.css'],
})
export class MessageriePageComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = ''; // Nueva propiedad para el input del mensaje

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(content: string, user: string) {
    if (content.trim().length > 0) {
      // Verificar que no se envíen mensajes vacíos
      this.chatService.sendMessage(content, user).then(() => {
        this.newMessage = ''; // Limpiar el campo de texto después de enviar
      });
    }
  }
}

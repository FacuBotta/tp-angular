import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/messages.service';
import { NgFor, NgIf } from '@angular/common'; // Agregar para usar directivas de Angular
import { FormsModule } from '@angular/forms'; // Para el uso de [(ngModel)]
import { Observable } from 'rxjs';
import { messageType } from '../../types';

@Component({
  selector: 'app-messagerie-page',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule], // Importar NgFor, NgIf, FormsModule
  templateUrl: './messagerie-page.component.html',
  styleUrls: ['./messagerie-page.component.css'],
})
export class MessageriePageComponent implements OnInit {
  newMessage: string = ''; // Nueva propiedad para el input del mensaje

  messages$: Observable<messageType[]>; // Solo declaras el tipo

  messages: messageType[] = [];

  constructor(private chatService: ChatService) {
    // Asignas el observable proveniente del servicio
    this.messages$ = this.chatService.messages$;
  }

  ngOnInit(): void {
    // Te suscribes al observable de mensajes para actualizarlos en tiempo real
    this.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(content: string, user: string) {
    // Aquí puedes activar el envío del mensaje si habilitas el método en el servicio
    if (content.trim().length > 0) {
      this.chatService.sendMessage(content, user).then(() => {
        this.newMessage = ''; // Limpiar el campo de texto después de enviar
      });
    }
  }
}

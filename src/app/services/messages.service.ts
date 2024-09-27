import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore = inject(AngularFirestore);

  getMessages(): Observable<any[]> {
    return this.firestore
      .collection('messages', (ref) => ref.orderBy('timestamp'))
      .valueChanges();
  }

  sendMessage(content: string, user: string) {
    return this.firestore.collection('messages').add({
      content,
      user,
      sendAt: new Date(),
    });
  }

}

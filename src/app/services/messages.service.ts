import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  addDoc,
  Firestore,
  deleteDoc,
  getDocs,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { messageType } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore: Firestore = inject(Firestore);

  messages$: Observable<messageType[]>;

  constructor() {
    const messagesCollector = collection(this.firestore, 'messages');
    this.messages$ = collectionData(messagesCollector, {
      idField: 'id',
    }) as Observable<messageType[]>;
  }

  sendMessage(content: string, user: string) {
    const messagesCollection = collection(this.firestore, 'messages');
    return addDoc(messagesCollection, {
      content,
      user,
      sendAt: new Date(),
    });
  }
  async deleteAllMessages() {
    const messagesCollection = collection(this.firestore, 'messages');
    const messagesSnapshot = await getDocs(messagesCollection);

    const deletePromises = messagesSnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(this.firestore, 'messages', docSnapshot.id))
    );

    return Promise.all(deletePromises);
  }
}
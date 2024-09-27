import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  addDoc,
  Firestore,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
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

  createConversation(user: string, participants: string[]) {
    const messagesCollection = collection(this.firestore, 'conversations');
    return addDoc(messagesCollection, {
      participants: [user, ...participants],
      createdAt: new Date(),
    });
  }
  sendMessage(content: string, user: string, conversationId: string) {
    const messagesCollection = collection(this.firestore, 'messages');
    return addDoc(messagesCollection, {
      conversationId,
      user,
      content,
      sendAt: new Date(),
    });
  }

  getMessagesByConversation(conversationId: string): Observable<any[]> {
    const messagesCollection = collection(this.firestore, 'messages');
    const q = query(
      messagesCollection,
      where('conversationId', '==', conversationId)
    );
    return collectionData(q, { idField: 'id' });
  }

  getAllConversations(userId: string): Observable<any[]> {
    const conversationsCollection = collection(this.firestore, 'conversations');
    const q = query(
      conversationsCollection,
      where('participants', 'array-contains', userId)
    );
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
  deleteConversation(conversationId: string): Observable<void> {
    const conversationDocRef = doc(
      this.firestore,
      `conversations/${conversationId}`
    );
    const messagesCollection = collection(this.firestore, 'messages');

    const deleteMessagesBatch = async () => {
      const q = query(
        messagesCollection,
        where('conversationId', '==', conversationId)
      );
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(this.firestore);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    };
    return from(
      deleteMessagesBatch().then(() => deleteDoc(conversationDocRef))
    );
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
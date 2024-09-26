import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA68aYsNl5jK0GU2XiSvRCh2uKdVs1TKyI',
  authDomain: 'testangular-c35fe.firebaseapp.com',
  projectId: 'testangular-c35fe',
  storageBucket: 'testangular-c35fe.appspot.com',
  messagingSenderId: '654842312937',
  appId: '1:654842312937:web:5e8efb8acd4bb437ded878',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};

import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBtZma3KaYAEgYKOEChLozGcDFPx4JQ4oU",
  authDomain: "interviewprep-c0c4e.firebaseapp.com",
  projectId: "interviewprep-c0c4e",
  storageBucket: "interviewprep-c0c4e.firebasestorage.app",
  messagingSenderId: "577935003587",
  appId: "1:577935003587:web:3a8b282b8f5f467fbbf776",
  measurementId: "G-7HR8WZZXYF",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);


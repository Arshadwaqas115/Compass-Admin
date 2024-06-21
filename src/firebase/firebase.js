import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbKII-58eBE_4voeZ84x-QTy3BFneyfT0",
  authDomain: "compass-dc245.firebaseapp.com",
  projectId: "compass-dc245",
  storageBucket: "compass-dc245.appspot.com",
  messagingSenderId: "510532264460",
  appId: "1:510532264460:web:d410840da967241bb4c429",
  measurementId: "G-4QKTY1Q0VV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCyWus7J1DFTmEWZOxO9LxanClZLE8VCWk",
  authDomain: "crm-project-22c8b.firebaseapp.com",
  projectId: "crm-project-22c8b",
  storageBucket: "crm-project-22c8b.appspot.com",
  messagingSenderId: "242026830824",
  appId: "1:242026830824:web:93325a2023a9cf7065625d",
  measurementId: "G-PST38YRZJ3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);


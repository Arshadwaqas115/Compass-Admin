import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB1WroDsrmwkZKQxDyI--NXeUmefone1_I",
  authDomain: "compass-442c5.firebaseapp.com",
  projectId: "compass-442c5",
  storageBucket: "compass-442c5.appspot.com",
  messagingSenderId: "294947124366",
  appId: "1:294947124366:web:4a9ccd16115474201ac5df",
  measurementId: "G-00JQZ5F55G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);


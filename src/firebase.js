import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAdexqtFzXdLMOAulMB6Lkx3OVHAoSRwF4",
  appId: "1:870482339256:web:93d417eb11020965f71b4d",
  messagingSenderId: "870482339256",
  projectId: "aquaapp-1564f",
  authDomain: "aquaapp-1564f.firebaseapp.com",
  storageBucket: "aquaapp-1564f.firebasestorage.app",
  measurementId: "G-B0KSD05L1D",
  databaseURL: "https://aquaapp-1564f-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;

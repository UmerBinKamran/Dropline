import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdTt-8eH0xLdhvRJfkVIR35w-1Ei6gKUQ",
  authDomain: "dropline-store.firebaseapp.com",
  projectId: "dropline-store",
  storageBucket: "dropline-store.firebasestorage.app",
  messagingSenderId: "337885540226",
  appId: "1:337885540226:web:124f4bb3d8965c23a2299b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving order: ", error);
    throw error;
  }
}

export { db, saveOrder };

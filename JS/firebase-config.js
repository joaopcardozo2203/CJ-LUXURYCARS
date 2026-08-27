import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAPwdBXBJz4rv7qeHQKjiPE26AMVHMR0Ig",
  authDomain: "cj-luxurycars.firebaseapp.com",
  projectId: "cj-luxurycars",
  storageBucket: "cj-luxurycars.firebasestorage.app",
  messagingSenderId: "901005850219",
  appId: "1:901005850219:web:82a5528283ffaefd32e32e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

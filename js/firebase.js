import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCkMVWQ4NCqV7yJIUwBwu2NImetw7zUJeY",
    authDomain: "scammer-database.firebaseapp.com",
    projectId: "scammer-database",
    storageBucket: "scammer-database.firebasestorage.app",
    messagingSenderId: "257014278130",
    appId: "1:257014278130:web:1c527b320f36b4d6c5ed6b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

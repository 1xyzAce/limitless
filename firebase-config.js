import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyCVO5CFgR53-M4W8M8iEF6dzYs8VQAuC1c",
    authDomain: "limitlessfreeroam.firebaseapp.com",
    projectId: "limitlessfreeroam",
    storageBucket: "limitlessfreeroam.appspot.com",
    messagingSenderId: "811999351879",
    appId: "1:811999351879:web:441eaf264989293c520d62",
    measurementId: "G-2JF76651L2"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVO5CFgR53-M4W8M8iEF6dzYs8VQAuC1c",
    authDomain: "limitlessfreeroam.firebaseapp.com",
    projectId: "limitlessfreeroam",
    storageBucket: "limitlessfreeroam.appspot.com",
    messagingSenderId: "811999351879",
    appId: "1:811999351879:web:441eaf264989293c520d62",
    measurementId: "G-2JF76651L2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

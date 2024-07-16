// Ensure Firebase is initialized
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

function updateProfileUI(user, userData) {
    document.getElementById('profile-picture').src = userData.profile_picture || 'default-profile.png';
    document.getElementById('username').textContent = userData.username || user.email;
    document.getElementById('role-tag').textContent = userData.role || 'Member';
}

auth.onAuthStateChanged((user) => {
    if (user) {
        getDoc(doc(db, 'users', user.uid)).then((doc) => {
            const userData = doc.data();
            updateProfileUI(user, userData);
        }).catch((error) => {
            console.error("Error fetching user data: ", error);
        });
    } else {
        window.location.href = 'login.html';
    }
});

import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', async () => {
    const user = auth.currentUser;
    if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        document.getElementById('username').textContent = userData.username || 'No Username';
        document.getElementById('role-tag').textContent = getRoleTag(userData.role);
        document.getElementById('profile-picture').src = userData.profile_picture || 'default-profile.png';
    }
});

function getRoleTag(role) {
    switch (role) {
        case 1:
            return 'Admin';
        case 2:
            return 'Moderator';
        default:
            return 'User';
    }
}

// Ensure Firebase is initialized
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = 'index.html';
            showNotification('Login successful!');
        })
        .catch((error) => {
            console.error("Login Error: ", error);
            showNotification('Login failed: ' + error.message);
        });
});

document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return setDoc(doc(db, 'users', user.uid), {
                username: user.email.split('@')[0],
                profile_picture: '',
                role: 'Member'
            });
        })
        .then(() => {
            window.location.href = 'login.html';
            showNotification('Registration successful!');
        })
        .catch((error) => {
            console.error("Registration Error: ", error);
            showNotification('Registration failed: ' + error.message);
        });
});

document.getElementById('logout')?.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'login.html';
            showNotification('Logout successful!');
        })
        .catch((error) => {
            console.error("Logout Error: ", error);
            showNotification('Logout failed: ' + error.message);
        });
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

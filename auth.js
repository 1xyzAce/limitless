import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const updateProfileForm = document.getElementById('update-profile-form');
    const profileTab = document.getElementById('profile-tab');

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showNotification('Login successful!');
            window.location.href = 'index.html'; // Redirect to home
        } catch (error) {
            showNotification('Login failed: ' + error.message);
        }
    });

    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                username: '',
                profile_picture: '',
                role: 0
            });
            showNotification('Registration successful!');
            window.location.href = 'index.html'; // Redirect to home
        } catch (error) {
            showNotification('Registration failed: ' + error.message);
        }
    });

    updateProfileForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newProfilePicture = document.getElementById('new-profile-picture').value;

        const user = auth.currentUser;
        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    username: newUsername,
                    profile_picture: newProfilePicture
                });
                showNotification('Profile updated successfully!');
                window.location.reload();
            } catch (error) {
                showNotification('Profile update failed: ' + error.message);
            }
        }
    });

    document.getElementById('logout-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            showNotification('Logout successful!');
            window.location.href = 'login.html'; // Redirect to login
        } catch (error) {
            showNotification('Logout failed: ' + error.message);
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            profileTab?.classList.remove('hidden');
            document.getElementById('new-username')?.setAttribute('value', user.displayName || '');
        } else {
            profileTab?.classList.add('hidden');
        }
    });

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js';
import { emoji } from 'https://cdnjs.cloudflare.com/ajax/libs/emojione/3.1.0/emojione.min.js';

const firebaseConfig = {
    apiKey: "AIzaSyCVO5CFgR53-M4W8M8iEF6dzYs8VQAuC1c",
    authDomain: "limitlessfreeroam.firebaseapp.com",
    projectId: "limitlessfreeroam",
    storageBucket: "limitlessfreeroam.appspot.com",
    messagingSenderId: "811999351879",
    appId: "1:811999351879:web:441eaf264989293c520d62",
    measurementId: "G-2JF76651L2"
  };

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.currentUser;

    if (user) {
        document.getElementById('profile-tab').style.display = 'block';
        document.getElementById('login-tab').style.display = 'none';
        document.getElementById('register-tab').style.display = 'none';
    } else {
        document.getElementById('profile-tab').style.display = 'none';
        document.getElementById('login-tab').style.display = 'block';
        document.getElementById('register-tab').style.display = 'block';
    }

    if (document.getElementById('post-form')) {
        document.getElementById('post-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const text = document.getElementById('text').value;
            const images = document.getElementById('images').files;
            const user = auth.currentUser;

            if (user) {
                try {
                    const postRef = await addDoc(collection(db, 'posts'), {
                        title,
                        text,
                        userId: user.uid,
                        createdAt: new Date()
                    });

                    if (images.length > 0) {
                        for (const file of images) {
                            const imageRef = ref(storage, `posts/${postRef.id}/${file.name}`);
                            await uploadBytes(imageRef, file);
                            const imageURL = await getDownloadURL(imageRef);
                            await updateDoc(postRef, { images: [...(await getDoc(postRef)).data().images || [], imageURL] });
                        }
                    }

                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Error posting document: ", error);
                }
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Error logging in: ", error);
            }
        });
    }

    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const username = document.getElementById('register-username').value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, 'users', user.uid), {
                    username,
                    email
                });
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Error registering: ", error);
            }
        });
    }

    if (document.getElementById('settings-form')) {
        document.getElementById('settings-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username-input').value;
            const profilePictureInput = document.getElementById('profile-picture-input').files[0];
            const user = auth.currentUser;

            if (user) {
                try {
                    if (profilePictureInput) {
                        const profilePicRef = ref(storage, `profile_pictures/${user.uid}`);
                        await uploadBytes(profilePicRef, profilePictureInput);
                        const profilePicURL = await getDownloadURL(profilePicRef);
                        await updateDoc(doc(db, 'users', user.uid), { profilePicture: profilePicURL });
                    }

                    if (username) {
                        await updateDoc(doc(db, 'users', user.uid), { username });
                    }

                    showNotification('Profile updated successfully!');
                } catch (error) {
                    console.error("Error updating profile: ", error);
                }
            }
        });
    }

    // Function to show notifications
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'notification';
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle?.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });

    // Initialize dark mode based on local storage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = savedDarkMode;
    document.body.classList.toggle('dark-mode', savedDarkMode);
});

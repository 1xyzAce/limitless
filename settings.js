// Ensure Firebase is initialized
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

document.getElementById('snow-toggle')?.addEventListener('change', (e) => {
    if (e.target.checked) {
        startSnowEffect();
    } else {
        stopSnowEffect();
    }
});

document.getElementById('theme-toggle')?.addEventListener('change', (e) => {
    document.body.classList.toggle('light-mode', e.target.checked);
});

document.getElementById('change-username')?.addEventListener('click', () => {
    const username = prompt('Enter new username:');
    if (username) {
        const user = auth.currentUser;
        if (user) {
            updateDoc(doc(db, 'users', user.uid), { username: username })
                .then(() => showNotification('Username updated!'))
                .catch((error) => showNotification('Failed to update username: ' + error.message));
        }
    }
});

document.getElementById('change-profile-picture')?.addEventListener('click', () => {
    const profilePicture = prompt('Enter new profile picture URL:');
    if (profilePicture) {
        const user = auth.currentUser;
        if (user) {
            updateDoc(doc(db, 'users', user.uid), { profile_picture: profilePicture })
                .then(() => showNotification('Profile picture updated!'))
                .catch((error) => showNotification('Failed to update profile picture: ' + error.message));
        }
    }
});

document.getElementById('logout')?.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'login.html';
            showNotification('Logout successful!');
        })
        .catch((error) => showNotification('Logout failed: ' + error.message));
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function startSnowEffect() {
    const script = document.createElement('script');
    script.src = 'snow.js';
    document.body.appendChild(script);
}

function stopSnowEffect() {
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(flake => flake.remove());
}

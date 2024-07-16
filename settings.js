import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    const snowToggle = document.getElementById('snow-toggle');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const logoutForm = document.getElementById('logout-form');
    const updateProfileForm = document.getElementById('update-profile-form');

    // Check local storage for snow effect preference
    const snowEffectEnabled = localStorage.getItem('snowEffectEnabled') === 'true';
    snowToggle.checked = snowEffectEnabled;
    toggleSnowEffect(snowEffectEnabled);

    // Check local storage for dark mode preference
    const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    darkModeToggle.checked = darkModeEnabled;
    toggleDarkMode(darkModeEnabled);

    snowToggle.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('snowEffectEnabled', isChecked);
        toggleSnowEffect(isChecked);
    });

    darkModeToggle.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('darkModeEnabled', isChecked);
        toggleDarkMode(isChecked);
    });

    logoutForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            showNotification('Logout successful!');
            window.location.href = 'login.html'; // Redirect to login
        } catch (error) {
            showNotification('Logout failed: ' + error.message);
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

    function toggleSnowEffect(isEnabled) {
        const snowContainer = document.querySelector('.snow');
        if (isEnabled) {
            if (!snowContainer) {
                const container = document.createElement('div');
                container.className = 'snow';
                document.body.appendChild(container);
                createSnowflakes(container);
            }
        } else {
            if (snowContainer) {
                document.body.removeChild(snowContainer);
            }
        }
    }

    function createSnowflakes(container) {
        for (let i = 0; i < 100; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = '❄'; // Or use a Unicode character or image
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
            snowflake.style.fontSize = `${Math.random() * 1.5 + 0.5}em`;
            container.appendChild(snowflake);
        }
    }

    function toggleDarkMode(isEnabled) {
        if (isEnabled) {
            document.body.style.backgroundColor = 'rgb(18, 18, 18)';
            document.body.style.color = 'rgb(236, 236, 236)';
        } else {
            document.body.style.backgroundColor = 'rgb(33, 33, 33)';
            document.body.style.color = 'rgb(236, 236, 236)';
        }
    }

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});
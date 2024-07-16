document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('register-form').addEventListener('submit', register);

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function login(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showNotification('Login successful!');
            window.location.href = 'profile.html';
        })
        .catch((error) => {
            console.error("Error logging in: ", error);
            showNotification('Login failed: ' + error.message);
        });
}

function register(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                email: user.email,
                role: 'Member',
                profile_picture: 'default.png'
            });
        })
        .then(() => {
            showNotification('Registration successful!');
            window.location.href = 'profile.html';
        })
        .catch((error) => {
            console.error("Error registering: ", error);
            showNotification('Registration failed: ' + error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

if (window.location.pathname.endsWith('profile.html')) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('profile-info').innerHTML = `
                        <p>Email: ${userData.email}</p>
                        <p>Role: ${userData.role}</p>
                        <p>Profile Picture: <img src="${userData.profile_picture}" alt="Profile Picture"></p>
                    `;
                } else {
                    console.error("No such document!");
                }
            }).catch((error) => {
                console.error("Error getting document: ", error);
            });
        } else {
            window.location.href = 'login.html';
        }
    });
} else if (window.location.pathname.endsWith('index.html')) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('forum-section').style.display = 'block';
            loadPosts();
        }
    });
}

function loadPosts() {
    db.collection('posts').get().then((querySnapshot) => {
        const posts = document.getElementById('posts');
        posts.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            posts.innerHTML += `<div><strong>${post.username}:</strong> ${post.content}</div>`;
        });
    });
}

document.getElementById('post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('post-content').value;
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get().then((doc) => {
            const username = doc.data().username || user.email;
            return db.collection('posts').add({
                content: content,
                username: username,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(() => {
            document.getElementById('post-content').value = '';
            loadPosts();
        }).catch((error) => {
            console.error("Error adding post: ", error);
            showNotification('Failed to add post: ' + error.message);
        });
    }
});

document.getElementById('update-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const profilePicture = document.getElementById('profile-picture').value;
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({
            username: username,
            profile_picture: profilePicture
        }).then(() => {
            showNotification('Profile updated!');
            location.reload();
        }).catch((error) => {
            console.error("Error updating profile: ", error);
            showNotification('Failed to update profile: ' + error.message);
        });
    }
});

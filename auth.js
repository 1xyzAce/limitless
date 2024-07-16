document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('register-form').addEventListener('submit', register);

function login(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'profile.html';
        })
        .catch((error) => {
            console.error("Error logging in: ", error);
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
            window.location.href = 'profile.html';
        })
        .catch((error) => {
            console.error("Error registering: ", error);
        });
}

function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

if (window.location.pathname === '/profile.html') {
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
}
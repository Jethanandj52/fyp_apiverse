import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    doc,
    setDoc
} from './script-config.js';

// Signup Function
window.signup = function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userName = document.getElementById("userName")

    createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            const user = userCredential.user;

            // Add email to Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                userName: userName.value
            });

            alert("Thank you for signing up, " + user.email);
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
};

// Sign-in Function
window.signin = function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill in the required fields");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (email === "admin@gmail.com") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "home.html";
            }
        })
        .catch((error) => {
            alert("Login Failed: " + error.message);
        });
};

// Google Sign-in Function
window.googleSignIn = function() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then(async(result) => {
            const user = result.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email
            });

            if (user.email === "admin@gmail.com") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "home.html";
            }
        })
        .catch((error) => {
            alert("Google Sign-in Failed: " + error.message);
        });
};

// Forgot Password Function
window.forget = function() {
    const email = document.getElementById("email").value;

    if (email === "") {
        alert("Please enter your email address.");
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
};

// Password Show/Hide
const password = document.getElementById("password");
const passwordToggle = document.getElementById("togglePassword");

window.passwordShow = function() {
    if (password.type === "password") {
        password.type = "text";
        passwordToggle.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        password.type = "password";
        passwordToggle.classList.replace("fa-eye-slash", "fa-eye");
    }
};
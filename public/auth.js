import { app } from "./firebase-config.js";
import { 
    getAuth, GoogleAuthProvider, signInWithPopup, 
    signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Email/Password Login
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html"; // Redirect to notes page
    } catch (error) {
        document.getElementById("error-message").textContent = error.message;
    }
});

// Email/Password Sign Up
document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html"; // Redirect to notes page
    } catch (error) {
        document.getElementById("error-message").textContent = error.message;
    }
});

// Google Sign-In
document.getElementById("googleLoginBtn").addEventListener("click", async () => {
    try {
        console.log("Google Sign-In clicked");
        const result = await signInWithPopup(auth, provider);
        console.log("Google Sign-In Success:", result.user);
        window.location.href = "index.html"; // Redirect to notes page
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        document.getElementById("error-message").textContent = error.message;
    }
});

// Logout Function
export function logoutUser() {
    signOut(auth).then(() => {
        window.location.href = "login.html"; // Redirect to login page
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

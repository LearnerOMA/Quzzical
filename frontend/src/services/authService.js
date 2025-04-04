import app from '../firebaseConfig'; // Import the initialized app
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const API_BASE_URL = "http://localhost:5000";

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    localStorage.setItem("token", token);
    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Sign up with Email & Password
export async function signUpWithEmailPassword(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json(); // Parse response JSON

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

// Sign in with Email & Password
export const signInWithEmailPassword = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid email or password.");
    }

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Store user details
    } else {
      console.error("Access token missing in response:", data);
    }    
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export default app;
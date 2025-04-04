// src/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCkhrBhlg0xNHV5q9-9lnr3t799jDH-zNk",
    authDomain: "ai-quiz-generator-3a625.firebaseapp.com",
    projectId: "ai-quiz-generator-3a625",
    storageBucket: "ai-quiz-generator-3a625.firebasestorage.app",
    messagingSenderId: "213573911883",
    appId: "1:213573911883:web:fa6caca41974754f3794ce",
    measurementId: "G-LYX6VZ6503"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
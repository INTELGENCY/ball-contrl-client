// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-20912.firebaseapp.com",
    projectId: "mern-blog-20912",
    storageBucket: "mern-blog-20912.appspot.com",
    messagingSenderId: "962053908331",
    appId: "1:962053908331:web:904a1bb29a8d50cd9ace2e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

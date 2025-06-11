// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdY45xqD9H_Mhpwf5wFXgwNKCuNG4jN18",
  authDomain: "tradeiqq.firebaseapp.com",
  projectId: "tradeiqq",
  storageBucket: "tradeiqq.appspot.com", // Corrected storageBucket from .firebasestorage.app to .appspot.com as per standard
  messagingSenderId: "444022294994",
  appId: "1:444022294994:web:446e792015e50b49dfe00b",
  measurementId: "G-V0KS3KSC4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app); // Analytics can be added if needed

export { app, auth };

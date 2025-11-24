// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVM_LrtP98FF7QApTYjR2-QfRgyyMutoc",
  authDomain: "munoflix-6ce99.firebaseapp.com",
  projectId: "munoflix-6ce99",
  storageBucket: "munoflix-6ce99.firebasestorage.app",
  messagingSenderId: "238798593656",
  appId: "1:238798593656:web:0c754fe880dced8688978d",
  measurementId: "G-1CJGXEL2C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
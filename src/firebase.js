import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace this with your actual Firebase configuration
  apiKey: "AIzaSyBb05V0jQiJOXMS6CKcrJVHU_2a-jF_9Rs",
  authDomain: "personal-diary-554d7.firebaseapp.com",
  projectId: "personal-diary-554d7",
  storageBucket: "personal-diary-554d7.appspot.com",
  messagingSenderId: "312788217335",
  appId: "1:312788217335:web:70bb6117cb730dc0aa12f2",
  measurementId: "G-Q922K35XPK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBb05V0jQiJOXMS6CKcrJVHU_2a-jF_9Rs",
//   authDomain: "personal-diary-554d7.firebaseapp.com",
//   projectId: "personal-diary-554d7",
//   storageBucket: "personal-diary-554d7.appspot.com",
//   messagingSenderId: "312788217335",
//   appId: "1:312788217335:web:70bb6117cb730dc0aa12f2",
//   measurementId: "G-Q922K35XPK"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
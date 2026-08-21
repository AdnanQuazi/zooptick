// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgvAixJGchd1H8mFQInrGNIKlP4uaL7Q8",
  authDomain: "noxsh-z.firebaseapp.com",
  projectId: "noxsh-z",
  storageBucket: "noxsh-z.appspot.com",
  messagingSenderId: "404639498818",
  appId: "1:404639498818:web:7a6523579fa91c76b4e3db",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
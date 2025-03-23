// firebase.js (Frontend)
import { initializeApp } from 'firebase/app'; 
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDcSYQNfPgrsFC7t46qlYQoBPvX5bwyMek",
  authDomain: "lockedin-d9efd.firebaseapp.com",
  projectId: "lockedin-d9efd",
  storageBucket: "lockedin-d9efd.firebasestorage.app",
  messagingSenderId: "920911898664",
  appId: "1:920911898664:web:9819a2c78be301a5606d1d",
  measurementId: "G-L40TEVJQ0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };

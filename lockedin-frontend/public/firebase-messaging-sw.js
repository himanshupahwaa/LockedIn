// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging.js');

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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[Service Worker] Background Message received.', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

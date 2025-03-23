// App.js (Frontend)
import React, { useState, useEffect } from 'react';
import socket from './socket';  // Import socket instance
import { messaging, getToken, onMessage } from './firebase';  // Import Firebase messaging

const App = () => {
  const [timers, setTimers] = useState({});
  const [fcmToken, setFcmToken] = useState(null);  // State for FCM token
  const userId = 'user1'; // Hardcoded for now; you can change it dynamically

  // Request notification permission and get FCM token on mount
  useEffect(() => {
    // Log to check if socket is connected
    console.log('Socket connected:', socket.connected);
    
    // Request permission to receive notifications
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');

        // Get the FCM token
        getToken(messaging, { vapidKey: 'AIzaSyDcSYQNfPgrsFC7t46qlYQoBPvX5bwyMek' }).then((currentToken) => {
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            setFcmToken(currentToken);  // Set the token in state
            // Send the token to your backend
            sendTokenToBackend(currentToken);
          } else {
            console.log('No registration token available.');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving the token:', err);
        });
      } else {
        console.log('Notification permission denied.');
      }
    });

    // Listen for timer updates
    socket.on('timerUpdate', (updatedTimers) => {
      setTimers(updatedTimers);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('timerUpdate');
    };
  }, []);

  const startTimer = () => {
    socket.emit('startTimer', userId);
  };

  const stopTimer = () => {
    socket.emit('stopTimer', userId);
  };

  const sendTokenToBackend = (token) => {
    console.log("Sending FCM Token to backend:", token); // Log for debugging
  
    fetch('http://localhost:3000/storeToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        token: token,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Token stored successfully:', data);
    })
    .catch((error) => {
      console.error('Error storing token:', error);
    });
  };
  

  // Handle incoming push messages while the app is in the foreground
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Handle the payload and show notifications or update your UI
    });
  }, []);

  return (
    <div style={styles.container}>
      <h1>LockedIn Timer</h1>
      <p>Time: {timers[userId]?.time ?? 0} seconds</p>
      <button onClick={startTimer} style={styles.button}>Start Timer</button>
      <button onClick={stopTimer} style={styles.button}>Stop Timer</button>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  button: { margin: '10px', padding: '10px 20px', fontSize: '16px' }
};






export default App;

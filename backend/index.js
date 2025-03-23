const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const schedule = require('node-schedule');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize Firebase Admin
const admin = require('firebase-admin');
const serviceAccount = require('/Users/himanshupahwa/LockedIn/backend/lockedin-d9efd-firebase-adminsdk-fbsvc-d95157d473.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Store stopwatch data
let timers = {
  user1: { time: 0, running: false },
  user2: { time: 0, running: false }
};

// Schedule to reset timers at midnight
schedule.scheduleJob('0 0 * * *', () => {
  timers.user1.time = 0;
  timers.user2.time = 0;
  console.log('Timers reset at midnight');
});

// Handle connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('startTimer', (userId) => {
    timers[userId].running = true;
    sendNotification(userId, 'Timer started');
    io.emit('timerUpdate', timers);
  });

  socket.on('stopTimer', (userId) => {
    timers[userId].running = false;
    sendNotification(userId, 'Timer stopped');
    io.emit('timerUpdate', timers);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Function to send push notifications
function sendNotification(userId, message) {
  const otherUserId = userId === 'user1' ? 'user2' : 'user1';
  const registrationToken = 'other-user-fcm-token';  // This should be dynamically fetched

  const payload = {
    notification: {
      title: 'Timer Update',
      body: message,
    }
  };

  admin.messaging().sendToDevice(registrationToken, payload)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

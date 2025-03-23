// index.js (Backend)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const schedule = require('node-schedule');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Create socket.io instance attached to server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001',  // Allow frontend from this domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,  // Allow credentials if needed
  }
});

// Use CORS middleware for HTTP requests
app.use(cors({
  origin: 'http://localhost:3001', // Allow frontend from this domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Initialize Firebase Admin
const admin = require('firebase-admin');
const serviceAccount = 'C:\\Academic\\Self Learn\\Projects\\LockedIn\\LockedIn\\backend\\lockedin-d9efd-firebase-adminsdk-fbsvc-d95157d473.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Store stopwatch data
let timers = {
  user1: { time: 0, running: false },
  user2: { time: 0, running: false }
};

// Dummy storage for tokens (in real use, store them in a database)
let fcmTokens = {
  user1: 'user1-fcm-token',
  user2: 'user2-fcm-token',
};

// Schedule to reset timers at midnight
schedule.scheduleJob('0 0 * * *', () => {
  timers.user1.time = 0;
  timers.user2.time = 0;
  console.log('Timers reset at midnight');
});

// Handle socket connections
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

function sendNotification(userId, message) {
  const registrationToken = fcmTokens[userId];

  if (!registrationToken) {
    console.log("No registration token found for", userId);
    return;
  }

  const payload = {
    notification: {
      title: 'Timer Update',
      body: message,
    },
  };

  admin.messaging().send({
    token: registrationToken,
    notification: {
      title: payload.notification.title,
      body: payload.notification.body,
    },
  })
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

// Simple GET route to test the backend
app.get('/', (req, res) => {
  res.send('Backend is working');
});

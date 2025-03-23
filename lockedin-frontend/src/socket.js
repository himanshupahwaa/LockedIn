import { io } from "socket.io-client";

// Use the URL of your backend for Socket.io connection
const socket = io("http://localhost:3000", {
  transports: ['websocket'], // Force WebSocket transport (to avoid polling issues)
});

export default socket;

import { io } from "socket.io-client";

// Replace this with your backend URL or localhost
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // optional but helps avoid polling fallback
});

export default socket;

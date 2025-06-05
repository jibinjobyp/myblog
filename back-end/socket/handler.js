function onConnection(io, socket) {
  // Join a room
  
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Listen for messages and send them only to the room
  socket.on("send", (data) => {
    const { roomId, message } = data;

    console.log("Received message:", message, "in room:", roomId);

    // Send to everyone in the room except sender
    socket.to(roomId).emit("receiveMessage", message);
  });
}

module.exports = {
  onConnection,
};

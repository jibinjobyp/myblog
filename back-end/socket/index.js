const { onConnection } = require("./handler");

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Call the handler that deals with connected clients
    onConnection(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = registerSocketHandlers;

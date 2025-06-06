const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");
const userRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const { checkJwtToken } = require("./middleware/authMiddleware");
const registerSocketHandlers = require("./socket"); // ✅ Import socket handlers

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",

    methods: ["GET", "POST"],
  },
});

// ✅ Register socket events
registerSocketHandlers(io);

// ✅ Setup CORS
const corsOptions = {
  origin: "http://localhost:3000",
  origin: "https://myblog4n6.onrender.com",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// ✅ Connect MongoDB
connectDB();

// ✅ API Routes
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);

// ✅ Start server using `server.listen`
server.listen(5000, () => {
  console.log("🚀 Server is running on http://localhost:5000");
});

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";

// Configuração do Express

const app = express();
app.use(cors());
app.use(express.static(path.join(path.resolve(), "../../frontend/build/")));

// Configuração do servidor

const server = http.createServer(app);

// Socket.IO

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

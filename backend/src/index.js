import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";

// Configurações gerais

const PORT = 3001
const CORS_OPTIONS = {

    origin: `http://localhost:${PORT}`,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200

}

// Configuração do Express

const app = express();
app.use(cors(CORS_OPTIONS));
app.use(express.static(path.join(path.resolve(), "../frontend/build/"), { index: "index.html" }));

// Configuração do servidor

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => { 
    
    console.log(`Servidor HTTP executando na porta ${PORT}`) ;

});

// Socket.IO

const io = new Server(httpServer, { transports: ["websocket"], secure: false } );

io.on("connection", (socket) => {
  
    console.log(`Novo usuário conectado: ${socket.id}`);

    // Eventos definidos

    socket.on("join_room", (data) => {
        
        socket.join(data);
        console.log(`Usuário com o ID: ${socket.id} conectou-se à sala: ${data}`);
    
    });

    socket.on("send_message", (data) => {

        socket.to(data.room).emit("receive_message", data);

    });

    // Eventos padrões

    socket.on("disconnect", () => {

        console.log(`Usuário com o ID: ${socket.id} desconectado`);

    });
  
});

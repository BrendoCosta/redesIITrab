import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

/* ------------------------------------------------------------
 * CONFIGURAÇÕES DA CONEXÃO
 * ------------------------------------------------------------
 * Em redes domésticas/privadas, defina "HOST" com
 * o IP local do servidor no lugar de "localhost", assim você
 * poderá utilizar o chat através de outros dispositivo da lan.
 * IMPORTANTE: NÃO FAÇA ISSO EM REDES PÚBLICAS!
 * ------------------------------------------------------------
*/

const PROTOCOL = "ws";
const HOST     = "localhost";
const PORT     = "3001";

const socket   = io.connect(`${PROTOCOL}://${HOST}:${PORT}`, { transports: ["websocket"], secure: false });

// App

function App() {

    const [username, setUsername]   = useState("");
    const [room, setRoom]           = useState("");
    const [showChat, setShowChat]   = useState(false);

    const joinRoom = () => {

        if (username !== "" && room !== "") {

            socket.emit("join_room", room);
            setShowChat(true);

        }

    };

    return (

        <div className="App">
            {!showChat ? (
                
                <div className="joinChatWrapper">
                    <h3>Chat de redes</h3>
                    <input type="text" placeholder="Nome" onChange={ (event) => { setUsername(event.target.value); } }/>
                    <input type="text" placeholder="ID da sala" onChange={(event) => { setRoom(event.target.value); } }/>
                    <button onClick={joinRoom}>Entrar na sala</button>
                </div>

            ) : (
                
                <Chat socket={socket} username={username} room={room}/>

            )}
        </div>

    );

}

export default App;

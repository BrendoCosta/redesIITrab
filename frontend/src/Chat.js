import React, { useEffect, useState } from "react";
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
    
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const scrollBottom = useScrollToBottom();

    const sendMessage = async () => {

        if (currentMessage !== "") {

            const messageData = {

                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),

            };

            await socket.emit("send_message", messageData);
            
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");

        }

    };

    useEffect(() => {

        socket.on("receive_message", (data) => {

            setMessageList((list) => [...list, data]);

        });

        scrollBottom();

    }, [socket]);

    return (

        <ScrollToBottom >
            <div className="chat-window">
                <div className="chat-header">
                    <p>Chat ao vivo</p>
                    <p>ID: {room}</p>
                </div>
                <div className="chat-body">
                    <div className="message-container">
                        {
                            messageList.map((messageContent) => {
                                return (
                                    <div className="message" id={username === messageContent.author ? "sended" : "received"}>
                                        <div>
                                            <div className="message-meta">
                                                <p id="author">{messageContent.author} | </p>
                                                <p id="time">{messageContent.time}</p>
                                            </div>
                                            <div className="message-content"><p>{messageContent.message}</p></div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Digite algo aqui"
                        onChange={ (event) => { setCurrentMessage(event.target.value) }}
                        onKeyPress={ (event) => { event.key === "Enter" && sendMessage() } }
                    />
                    <button onClick={sendMessage}>Enviar</button>
                </div>
            </div>
        </ScrollToBottom>
        
    );

}

export default Chat;

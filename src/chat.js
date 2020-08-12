import React from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat(props) {
    return (
        <>
            <div id="chat-messages" />
            <button onClick={socket.emit} />
        </>
    );
}

// one could use redux to store the chatMessage, but
// david believes this is a good place to use useState, we
// won't need this variable anywhere else

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "./socket";
import { getChatMessages, addChatMessage, chatMessages } from "./actions";

export default function Chat(props) {
    const [chatMessage, setChatMessage] = useState("");
    //const elemRef = useRef();
    return (
        <>
            <h2>this is the chaaaaat, it's not a caaaaat</h2>
            {/* <div id="chat-messages" ref={elemRef}>
                <textarea onChange={setChatMessage()}></textarea>
                <button onClick={socket.emit("chatMessage", chatMessage)}>
                    send
                </button>
            </div> */}
        </>
    );
}
// one could use redux to store the chatMessage, but
// david believes this is a good place to use useState, we
// won't need this variable anywhere else

//const [userInput, setUserInput] = useState("");

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "./socket";
import { getChatMessages, addChatMessage, chatMessages } from "./actions";

export default function Chat(props) {
    const [chatMessage, setChatMessage] = useState("");
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state.chatMessages);
    //console.log("chat component state.chatmessages", chatMessages);
    const handleChange = (e) => {
        setChatMessage(e.target.value);
        //console.log(elemRef);
    };
    const chatTracking = () => {
        elemRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    };
    useEffect(chatTracking, [chatMessages]);

    function click() {
        socket.emit("chatMessage", chatMessage);
        chatTracking();
        // chatTracking();
    }
    return (
        <React.Fragment>
            <h2>Chat room! Share ideas!</h2>
            <div className="chat-window" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((user, created_at) => (
                        <div key={created_at}>
                            <div className="picandname">
                                <img
                                    onClick={() => {
                                        window.location.href = `/user/${user.id}`;
                                    }}
                                    src={user.profile_pic}
                                />
                                <p className="names">
                                    {user.first} {user.last}:
                                </p>
                                <p>{user.message}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <div id="chat-send">
                <textarea onChange={handleChange}></textarea>
                <button onClick={() => click()}>send message</button>
            </div>
        </React.Fragment>
    );
}

// one could use redux to store the chatMessage, but <div id="chat-messages" ref={elemRef}>
// david believes this is a good place to use useState, we
// won't need this variable anywhere else

//const [userInput, setUserInput] = useState("");

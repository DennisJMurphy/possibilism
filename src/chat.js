import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "./socket";
import { getChatMessages, addChatMessage, chatMessages } from "./actions";

export default function Chat(props) {
    const [chatMessage, setChatMessage] = useState("");
    // const elemRef = useRef();
    const chatMessages = useSelector((state) => state.chatMessages);
    const handleChange = (e) => {
        setChatMessage(e.target.value);
        //console.log(chatMessage);
    };
    return (
        <>
            <h2>Chat room! Share ideas!</h2>
            <div className="chat-window">
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
                <button onClick={() => socket.emit("chatMessage", chatMessage)}>
                    send message
                </button>
            </div>
        </>
    );
}
{
    /* <div>
<h1>Profile Editor</h1>
<textarea
    defaultValue={this.props.bio}
    onChange={(e) => this.handleChange(e)}
    name="bio"
></textarea>
<button onClick={(e) => this.submit(e)}>save bio</button>
</div> */
}
// one could use redux to store the chatMessage, but <div id="chat-messages" ref={elemRef}>
// david believes this is a good place to use useState, we
// won't need this variable anywhere else

//const [userInput, setUserInput] = useState("");

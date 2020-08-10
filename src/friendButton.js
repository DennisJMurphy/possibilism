import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FriendButton(props) {
    const otherId = props.otherId;
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/check-friend/${otherId}`);
                //console.log("data from checkfriend", data);
                setButtonText(data.button);
            } catch (err) {
                console.log("axios error checkfriend", err);
            }
        })();
    }, [otherId]);
    function submit() {
        (async () => {
            if (buttonText == "make friendship request") {
                try {
                    const { request } = await axios.post(`/request/${otherId}`);
                    //console.log("what");
                    setButtonText("cancel invite");
                } catch (err) {
                    console.log("axios error friend request", err);
                }
            } else if (buttonText == "cancel invite") {
                try {
                    const { request } = await axios.post(
                        `/remove-row/${otherId}`
                    );
                    setButtonText("make friendship request");
                } catch (err) {
                    console.log("axios error friend cancel", err);
                }
            } else if (buttonText == "accept invite") {
                try {
                    const { request } = await axios.post(
                        `/add-friend/${otherId}`
                    );
                    setButtonText("unfriend");
                } catch (err) {
                    console.log("axios error friend accept", err);
                }
            } else if (buttonText == "unfriend") {
                try {
                    const { request } = await axios.post(
                        `/remove-row/${otherId}`
                    );
                    setButtonText("make friendship request");
                } catch (err) {
                    console.log("axios error unfriend", err);
                }
            }
        })();
    }

    // will need to get passed the id of the user
    // who is potentially being befriended

    // need axios get, check relatioship, fix button text

    // submit, database update, display new button text
    //console.log("OTHERID", otherId);
    return (
        <>
            <button onClick={(e) => submit()}>{buttonText} </button>
        </>
    );
}

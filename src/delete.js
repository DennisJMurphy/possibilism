import React, { useState, useEffect, useRef } from "react";
//import { useSelector, useDispatch } from "react-redux";
import axios from "./axios";
import { render } from "react-dom";

export default function Delete(props) {
    const [buttonText, setButtonText] = useState(
        "Delete account and all related content"
    );

    function submit() {
        (async () => {
            if (buttonText == "Delete account and all related content") {
                setButtonText("Yes Really!");
            } else if (buttonText == "Yes Really!") {
                setButtonText("I'm not kidding!");
            } else if (buttonText == "I'm not kidding!") {
                setButtonText("The next one deletes everything, right?");
            } else if (
                buttonText == "The next one deletes everything, right?"
            ) {
                setButtonText("DELETE EVERYTHING");
            } else if (buttonText == "DELETE EVERYTHING") {
                try {
                    const { request } = await axios.post("/delete-user");
                    setButtonText("...deleting...");
                    window.location.href = "/welcome#/";
                } catch (err) {
                    console.log("axios error profile delete", err);
                }
            }
        })();
    }

    return (
        <React.Fragment>
            <h1>Delete Account</h1>
            <h2>
                The button below will delete all of your account information.
            </h2>
            <h2>This includes all pictures and chat messages on the server.</h2>
            <h2>Proceed with caution!</h2>
            <button onClick={() => submit()}>{buttonText}</button>
        </React.Fragment>
    );
}

//     (async () => {
//         try {
//             const { data } = await axios.get(`/check-friend/${otherId}`);
//             //console.log("data from checkfriend", data);
//setButtonText("Delete account and all related content");
//         } catch (err) {
//             console.log("axios error checkfriend", err);
//         }
//     })();
// }, [otherId]);

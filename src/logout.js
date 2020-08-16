import React, { useState, useEffect, useRef } from "react";
//import { useSelector, useDispatch } from "react-redux";
import axios from "./axios";
import { render } from "react-dom";

export default function Logout() {
    const [buttonText, setButtonText] = useState(
        "Delete account and all related content"
    );

    function submit() {
        (async () => {
            try {
                const { request } = await axios.post("/logout-user");
                window.location.href = "/welcome#/login";
            } catch (err) {
                console.log("axios error logout", err);
            }
        })();
    }

    return (
        <React.Fragment>
            <h1>Logout</h1>
            <h2>The button below will log you out. Come back soon!</h2>
            <button onClick={() => submit()}>Logout</button>
        </React.Fragment>
    );
}

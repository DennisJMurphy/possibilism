import React, { useState, useEffect } from "react";
import axios from "./axios";
import { render } from "react-dom";

export default function FindPeople() {
    const [userInput, setUserInput] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (userInput == "") {
            (async () => {
                try {
                    const { data } = await axios.get("/newUsers");
                    //console.log("users in find people", data);
                    setUsers(data);
                } catch (err) {
                    console.log("axios error findPeople", err);
                }
            })();
        } else {
            (async () => {
                try {
                    const { data } = await axios.get(`/search/${userInput}`);
                    console.log("users in find people", data);
                    setUsers(data);
                    console.log("users", users);
                } catch (err) {
                    console.log("axios error findPeople search", err);
                }
            })();
        }
    }, [userInput]);

    return (
        <>
            <h1>Find People</h1>
            <input onChange={(e) => setUserInput(e.target.value)} />
            <button onClick={(e) => this.submit()}>Submit</button>
            {users &&
                users.map((user, id) => (
                    <div key={id}>
                        <img src={user.profile_pic} className="friends" />
                        <p>
                            {user.first} {user.last}
                        </p>
                    </div>
                ))}
        </>
    );
}

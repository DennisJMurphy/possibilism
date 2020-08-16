import React from "react";
import ProfilePic from "./profilepic";
import Logo from "./logo";
import { Link } from "react-router-dom";
export default function Header(props) {
    //console.log("header props", props);
    return (
        <nav id="header">
            <Logo />
            <Link to="/users/"> Find People</Link>
            <Link to="/friends"> Friends</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/"> Profile</Link>
            <Link to="/logout">Logout</Link>
            <Link to="/delete">Delete Profile</Link>
            <ProfilePic image={props.image} />
        </nav>
    );
}

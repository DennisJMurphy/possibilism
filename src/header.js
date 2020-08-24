import React from "react";
import ProfilePic from "./profilepic";
import Logo from "./logo";
import { Link } from "react-router-dom";
export default function Header(props) {
    //console.log("header props", props);
    return (
        <nav id="header-container">
            <div id="header">
                <Logo />
                <Link className="header-links" to="/users/">
                    {" "}
                    Find People
                </Link>
                <Link className="header-links" to="/friends">
                    {" "}
                    Friends
                </Link>
                <Link className="header-links" to="/projects">
                    Projects
                </Link>
                <Link className="header-links" to="/chat">
                    Chat
                </Link>
                <Link className="header-links" to="/">
                    {" "}
                    Profile
                </Link>
                <Link className="header-links" to="/logout">
                    Logout
                </Link>
                <ProfilePic image={props.image} />
            </div>
        </nav>
    );
}

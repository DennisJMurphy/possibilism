import React from "react";
import ProfilePic from "./profilepic";
import Logo from "./logo";
export default function Header(props) {
    //console.log("header props", props);
    return (
        <div id="header">
            <Logo />
            <ProfilePic />
        </div>
    );
}

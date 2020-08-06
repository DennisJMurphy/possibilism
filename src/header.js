import React from "react";
import ProfilePic from "./profilepic";
import Logo from "./logo";
import { PresignedPost } from "aws-sdk/clients/s3";
export default function Header(props) {
    //console.log("header props", props);
    return (
        <div id="header">
            <Logo />
            <ProfilePic image={props.image} />
        </div>
    );
}

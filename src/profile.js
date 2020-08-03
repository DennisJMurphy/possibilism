import React from "react";
import { ProfilePic } from "./profilepic";
import BioEditor from "./bio";
export default function Profile(props) {
    console.log("props", props);
    return (
        <div>
            <h1>I am profile</h1>
            <ProfilePic />
            <BioEditor />
        </div>
    );
}

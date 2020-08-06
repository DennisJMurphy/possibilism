import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio";
export default function Profile(props) {
    //console.log("props", props);
    return (
        <div className="profile">
            <h1>I am profile</h1>
            <ProfilePic
                toggleModal={props.toggleModal}
                newPic={props.newPic}
                image={props.image}
            />
            <BioEditor />
        </div>
    );
}

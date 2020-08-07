import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio";
export default function Profile(props) {
    console.log("props in profile", props);
    return (
        <div className="profile">
            <h1>
                {props.first} {props.last}
            </h1>
            <ProfilePic
                toggleModal={props.toggleModal}
                newPic={props.newPic}
                image={props.image}
            />
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}

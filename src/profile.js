import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio";
import { Link } from "react-router-dom";
export default function Profile(props) {
    //console.log("props in profile", props);
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
            <div className="footer-element">
                <p>
                    Remember, you can always leave this community and delete all
                    our stored data about you below. Please note that projects
                    must be delegated or deleted separately.
                </p>
                <Link to="/delete">Delete Profile</Link>
            </div>
        </div>
    );
}

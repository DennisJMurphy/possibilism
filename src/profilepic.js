import React from "react";
export default function ProfilePic(props) {
    console.log("props in profilepic", props);
    return (
        <React.Fragment>
            <div>I am the profile pic /presentational {props.first}</div>
        </React.Fragment>
    );
}

// this page is not yet working, because things
// Pete called this page something else - presentational, but it's called profile pic in the class notes anyway...

import React from "react";
//import ProfilePic from "./profilepic";
import Logo from "./logo";
//import "../public/style.css";
export default function Header(props) {
    console.log("props", props);
    return (
        <nav>
            <div>
                <div>
                    <Logo />
                </div>
                <div>
                    <h1>This header needs formatting.</h1>
                    <img
                        src="/noPic.png"
                        className="profilepicsmall"
                        height="70px"
                    />
                </div>
            </div>
        </nav>
    );
}

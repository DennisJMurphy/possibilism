import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Registration from "./register";

// if user is logged in, show small logo
// if user is logged out, show welcome page

let elem;

let isLoggedIn; //= null;
if (location.pathname == "/welcome") {
    isLoggedIn = false;
} else {
    isLoggedIn = true;
}
//console.log("isloggedin, start.js", isLoggedIn);
if (isLoggedIn == false) {
    elem = <Welcome />;
} else {
    elem = (
        <div>
            <img
                width="120px"
                className="logo"
                src="/Serious_Possibilists.jpg"
            />
        </div>
    );
}

ReactDOM.render(elem, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello World!</div>;
// }

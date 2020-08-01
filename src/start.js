import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
//import Registration from "./register";
//import App from "./app"; // no curly brackets if it's a default

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
            {/* <h1 onClick={this.toggleModal()}>is there t</h1> */}
            <img
                width="120px"
                className="logo"
                src="/Serious_Possibilists.jpg"
            />
        </div>
    );
}

ReactDOM.render(elem, document.querySelector("main"));

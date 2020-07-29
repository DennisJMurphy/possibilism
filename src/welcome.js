import React from "react";
import Registration from "./register.js";
function Welcome() {
    return (
        <div>
            <h1>We are not just silly optimists, we are rather...</h1>
            <img src="/Serious_Possibilists.jpg" />
            <h2>Join us!</h2>
            <div>
                <Registration />
            </div>
        </div>
    );
}
export default Welcome;

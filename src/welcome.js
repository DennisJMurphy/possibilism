import React from "react";
import Registration from "./register.js";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import ResetPassword from "./resetpassword.js";

const Welcome = () => (
    <HashRouter>
        <div>
            <h1>We are not just silly optimists, we are rather...</h1>
            <img src="/Serious_Possibilists.jpg" />
            <div>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                    <Route
                        exact
                        path="/resetpassword"
                        component={ResetPassword}
                    />
                </div>
            </div>
        </div>
    </HashRouter>
);

export default Welcome;

import React from "react";
import Registration from "./register.js";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import ResetPassword from "./resetpassword.js";
import ProjectSummaries from "./projectSummaries";

const Welcome = () => (
    <HashRouter>
        <div>
            <h1>We are not just silly optimists, we are rather...</h1>
            <img src="/Serious_Possibilists.jpg" />
            <p>Take a look at what we do:</p>
            <ProjectSummaries />
            <p>Look interesting? why not join us?</p>
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

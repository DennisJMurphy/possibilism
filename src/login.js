import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        //this[e.target.name] = e.target.value
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                console.log("data", data.success, data);
                if (data.success) {
                    this.setState({
                        error: false,
                    });
                    location.replace("/"); // replaces the url with the new url, making going back difficult
                } else {
                    this.setState({
                        error: true,
                    });
                    //error message, "something went wrong"
                }
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Something went wrong, try again.
                    </div>
                )}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="Email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    placeholder="Password"
                    type="password"
                />
                <button onClick={(e) => this.submit()}>Submit</button>
                <div></div>
                <Link to="/"> Made a mistake? Back to Registration.</Link>
                <div></div>
                <Link to="/resetpassword">
                    Click here to reset your password.
                </Link>
            </div>
        );
    }
}

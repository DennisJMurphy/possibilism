import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
export default class Registration extends React.Component {
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
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                guard: this.state.guard,
            })
            .then(({ data }) => {
                //console.log("data", data.success, data);
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
                <h2>Join us! </h2>
                {this.state.error && (
                    <div className="error">
                        {" "}
                        Something went wrong, try again.
                    </div>
                )}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    placeholder="First Name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    placeholder="Last Name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="Email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="guard"
                    placeholder="New Password"
                    type="password"
                />
                <button onClick={(e) => this.submit()}>Register</button>
                <div></div>
                <Link to="./login"> Already Registered? log in!</Link>
            </div>
        );
    }
}

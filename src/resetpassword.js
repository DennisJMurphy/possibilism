import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            email: "",
            success: true,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        axios
            .post("/resetpassword", {
                step: this.state.step,
                email: this.state.email,
                code: this.state.code,
                password: this.state.password,
            })
            .then(({ data }) => {
                //console.log("reset password data", data.success, data.step);
                if (data.success) {
                    this.setState({
                        error: false,
                        step: data.step,
                    });
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
        const { step } = this.state;
        if (step == 1) {
            return (
                <div>
                    {this.state.error && (
                        <div className="error">
                            Something went wrong, try again.
                        </div>
                    )}
                    <p>Forgot your password?</p>
                    <p>Please enter your email address:</p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        placeholder="Email"
                    />
                    <button onClick={(e) => this.submit()}>Submit</button>
                    <div></div>
                    <p>Or click </p>
                    <Link to="/">here</Link>
                    <p> to go back to Registration.</p>
                </div>
            );
        } else if (step == 2) {
            return (
                <div>
                    {this.state.error && (
                        <div className="error">
                            Something went wrong, try again.
                        </div>
                    )}
                    <p>
                        Great! You should have received an email with a code in
                        it.
                    </p>
                    <p>Please input the code and a new password.</p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="code"
                        placeholder="code"
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        placeholder="New Password"
                        type="password"
                    />
                    <button onClick={(e) => this.submit()}>Submit</button>
                </div>
            );
        } else if (step == 3) {
            return (
                <div>
                    <p>Great! It worked!</p>
                    <p>Please </p>
                    <Link to="./login">log in</Link>
                    <p>with your email and new password.</p>
                </div>
            );
        }
        ///////or
        // <div>
        //     {step == 1 && (<div></div>)}
        //     {step == 2 && (<div></div>)}
        // </div>
    }
}

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
                //code: this.state.code,
                //password: this.state.password,
            })
            .then(({ data }) => {
                console.log("data", data.success, data);
                if (data.success) {
                    this.setState({
                        error: false,
                        step: 2,
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
                    <Link to="/">
                        {" "}
                        Or click here to go back to Registration.
                    </Link>
                </div>
            );
        } else if (step == 2) {
            return <div></div>;
        } else if (step == 3) {
            return <div></div>;
        }
        ///////or
        // <div>
        //     {step == 1 && (<div></div>)}
        //     {step == 2 && (<div></div>)}
        // </div>
    }
}

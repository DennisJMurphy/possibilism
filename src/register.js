import React from "react";
import axios from "axios";
export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        //this[e.target.name] = e.target.value
        this.setState({
            [e.target.name]: e.target.value,
            [e.target.last]: e.target.value,
            [e.target.email]: e.target.value,
            [e.target.guard]: e.target.value,
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
                if (data.success) {
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
                    <div className="error"> Oops! You blew it!</div>
                )}
                <input onChange={(e) => this.handleChange(e)} name="first" />
                <input onChange={(e) => this.handleChange(e)} name="last" />
                <input onChange={(e) => this.handleChange(e)} name="email" />
                <input onChange={(e) => this.handleChange(e)} name="guard" />
                <button onClick={(e) => this.submit()}>Register</button>
            </div>
        );
    } // login for registered users comes later....
}

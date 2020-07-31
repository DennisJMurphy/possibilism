import React from "react";
import ProfilePic from "./profilepic";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("app has mounted!!!!");
        // need to get  some info via axios
        // new route on the server
        // /user could be good
        // then add the data back to state
        // call setState({}) and give it the object..
    }
    render() {
        return (
            <React.Fragment>
                <img
                    width="120px"
                    className="logo"
                    src="/Serious_Possibilists.jpg"
                />
                <ProfilePic first={this.state.first} last={this.state.last} />
            </React.Fragment>
        );
    }
}

import React from "react";
//import ProfilePic from "./profilepic";
import Header from "./header";
//import Uploader from "./uploader";
//import Profile from "./profile";
import axios from "axios";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //   uploaderIsVisible: false,
        };
        //  this.toggleModal = this.toggleModal.bind(this);
    }
    // a david idea...async and await.. try at some point
    // async componentDidMount() {
    //     const { data } = await Axios.get('/user');
    //     this.setState({ data });
    // }///////

    componentDidMount() {
        console.log("app has mounted!!!!");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data from app", data);
                this.setState({ data });
            })
            .catch(() => console.log("error"));

        //     // need to get  some info via axios
        //     // new route on the server
        //     // /user could be good
        //     // then add the data back to state
        //     // call setState({}) and give it the object..
    }
    toggleModal() {
        this.setState({
            // uploaderIsVisible: true,
        });
    }
    // instead of <div>....<React.Fragment>?
    render() {
        return (
            <div>
                <Header />
                {/* <Profile />
                <ProfilePic first={this.state.first} last={this.state.last} />
                {this.state.uploaderIsVisible && <Uploader />}
                <h1 onClick={this.toggleModal()}>is there t</h1> */}
            </div>
        );
    }
}

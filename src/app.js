import React from "react";
import ProfilePic from "./profilepic";
import Header from "./header";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import axios from "axios";
import { BrowserRouter, Route } from "react-router-dom";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //   uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
    }
    // a david idea...async and await.. try at some point
    // async componentDidMount() {
    //     const { data } = await Axios.get('/user');
    //     this.setState({ data });
    // }///////

    componentDidMount() {
        //console.log("app has mounted!!!!");
        axios
            .get("/user")
            .then(({ data }) => {
                //console.log("data from app", data);
                this.setState(data);
            })
            .catch(() => console.log("error"));

        //     // then add the data back to state
        //     // call setState({}) and give it the object..
    }
    toggleModal() {
        this.setState({
            uploaderIsVisible: true,
        });
    }
    // instead of <div>....<React.Fragment>?
    render() {
        //console.log("this state in app", this.state);
        return (
            <BrowserRouter>
                <div>
                    <Header />
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.profile_pic}
                                    toggleModal={this.toggleModal}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                    </div>
                    {this.state.uploaderIsVisible && <Uploader />}
                </div>
            </BrowserRouter>
        );
    }
}

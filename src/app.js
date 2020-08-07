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
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.newPic = this.newPic.bind(this);
        this.setBio = this.setBio.bind(this);
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
    setBio(bio) {
        //console.log("new app bio", bio); all good
        this.setState({
            bio: bio,
            editMode: false,
        });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    newPic(profile_pic) {
        //console.log("profile pic before setstate", profile_pic);
        this.setState({
            profile_pic: profile_pic,
            uploaderIsVisible: false,
        });
    }
    // instead of <div>....<React.Fragment>?
    render() {
        //console.log("bio in app", this.state.bio);
        return (
            <BrowserRouter>
                <div>
                    <Header image={this.state.profile_pic} />
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
                                    newPic={this.newPic}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader newPic={this.newPic} />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}

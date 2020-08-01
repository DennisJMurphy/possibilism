import React from "react";
// import ProfilePic from "./profilepic";
// import Uploader from "./uploader";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: !this.state.uploaderIsVisible,
        };
        this.toggleModal = this.toggleModal.bind(this);
    }
    // componentDidMount() {
    //     console.log("app has mounted!!!!");
    //     // need to get  some info via axios
    //     // new route on the server
    //     // /user could be good
    //     // then add the data back to state
    //     // call setState({}) and give it the object..
    // }
    // toggleModal() {
    //     this.setState({
    //         uploaderIsVisible: true,
    //     });
    // }
    // instead of <div>....<React.Fragment>?
    render() {
        return (
            <div>
                <h1 onClick={this.toggleModal()}>is there t</h1>
                <img
                    width="120px"
                    className="logo"
                    src="/Serious_Possibilists.jpg"
                />
            </div>
        );
    }
}
// {/* <ProfilePic first={this.state.first} last={this.state.last} />
// {this.state.uploaderIsVisible && <Uploader />} */}

import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        //console.log("other Profile did mount!");
        const { id } = this.props.match.params;
        const { data } = await axios.get("/other-user/" + id);
        //console.log("data other profile", data);
        if (data.sameUser) {
            this.props.history.push("/");
        } else {
            this.setState({
                first: data.first,
                last: data.last,
                profile_pic: data.profile_pic,
                bio: data.bio,
                id: id,
            });
        }
        //console.log("thisstatefirst", this.state.first);
    }
    render() {
        return (
            <div className="profile">
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <img src={this.state.profile_pic} />
                <p>{this.state.bio}</p>
                <FriendButton otherId={this.state.id} />
            </div>
        );
    }
}

// id will be in the props
// 'match' object has a property called "params"
// if params has a property called id
// this.props.match.params.id

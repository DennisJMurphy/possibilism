import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        const { id } = this.props.match.params.id;
        const { data } = await axios.get("/other-user/" + id);
        // .then(({ data }) => {
        console.log("data other profile", data);
        // });
    }
    render() {
        return (
            <>
                <p>get the deets first</p>
                {/* <h1> ignore this stuff it's just placeholders
                    {first}
                    {last}
                </h1>
                <img source={image} alt={(first, last)} />
                <p>{bio}</p> */}
            </>
        );
    }
}

// id will be in the props
// 'match' object has a property called "params"
// if params has a property called id
// this.props.match.params.id

import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async compenentDidMount() {
        const { id } = this.props.match.params;
        const { data } = await axios.get("/user" + id);
    }
}

// id will be in the props
// property object has a ___ called "params"
// if params has a property called id

// needs to be class based because of the state bit
import React from "react";
import axios from "./axios";
class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        //console.log("props from bio", props);
        this.state = {
            editMode: false,
            //bio: this.props.bio,
            buttonText: "edit bio",
        };
    }
    handleChange(e) {
        this.setState({
            bio: e.target.value,
        });
    }
    toggleEdit() {
        this.setState({
            editMode: !this.state.editMode,
        });
    }
    submit() {
        axios
            .post("/userbio", {
                bio: this.state.bio,
            })
            .then(({ data }) => {
                //console.log("data", data.success, data);
                if (data.success) {
                    //this.props.newPic(data.data);
                    this.setState({
                        bio: data.data,
                        editMode: false,
                        error: false,
                    });

                    //console.log("data.data?", data.data); it's ok
                    this.props.setBio(data.data);
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }
    render() {
        let buttonTextNow = this.state.buttonText;
        if (this.props.bio == "") {
            buttonTextNow = "add bio";
        }
        if (this.state.editMode === false) {
            return (
                <>
                    <h1>User Bio</h1>
                    <p>{this.props.bio}</p>
                    <button onClick={() => this.toggleEdit()}>
                        {buttonTextNow}
                    </button>
                </>
            );
        } else if (this.state.editMode === true) {
            return (
                <div>
                    <h1>Profile Editor</h1>
                    <textarea
                        defaultValue={this.props.bio}
                        onChange={(e) => this.handleChange(e)}
                        name="bio"
                    ></textarea>
                    <button onClick={(e) => this.submit(e)}>save bio</button>
                </div>
            );
        }
    }
}

export default BioEditor;

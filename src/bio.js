// needs to be class based because of the state bit
import React from "react";
import axios from "axios";
class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
        this.state = {
            editMode: false,
            buttonText: "edit bio",
            bio: this.props.bio,
        };
    }
    // handleChange(e) {
    //     console.log("e.target.textarea", e.target.textarea);
    //     this.setState({
    //         newBio: e.target.textarea.value,
    //     });
    // }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    toggleModal() {
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
                    this.setState({
                        bio: data.data,
                        editMode: false,
                        error: false,
                    });
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
        if (this.state.editMode === false) {
            if (this.props.bio == "") {
                this.setState({
                    buttonText: "add bio",
                });
            }
            return (
                <>
                    <h1>User Bio</h1>
                    <button onClick={() => this.toggleModal()}>
                        {this.state.buttonText}
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

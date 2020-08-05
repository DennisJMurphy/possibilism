import React from "react";
import axios from "axios";
class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            profile_pic: e.target.files[0],
        });
    }

    submit() {
        //console.log("Profilepic?", this.state.profile_pic);
        let formData = new FormData();
        formData.append("profile_pic", this.state.profile_pic);
        //console.log("formdata", formData);
        axios
            .post("/upload", formData, {})
            .then(({ data }) => {
                //console.log("data", data.success, data);
                if (data.success) {
                    this.setState({
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
        return (
            <div>
                <h1>Upload new Pic</h1>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="profile_pic"
                    accept="image/*"
                    type="file"
                />
                <button onClick={(e) => this.submit(e)}>submit</button>
            </div>
        );
    }
}

export default Uploader;

import axios from "axios";
import React from "react";
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
                    console.log("uploader data return", data);
                    console.log("this.props", this.props);
                    this.setState({
                        //profile_pic: data.data,
                        error: false,
                    });
                    this.props.newPic(data.data);
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

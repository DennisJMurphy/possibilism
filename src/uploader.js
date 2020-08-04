import React from "react";
import axios from "axios";
class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        //this[e.target.name] = e.target.value
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        axios
            .post("/upload", {
                profile_pic: this.state.profile_pic,
            })
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
                    placeholder="file"
                    type="file"
                />
                <button onClick={(e) => this.submit()}>submit</button>
            </div>
        );
    }
}

export default Uploader;

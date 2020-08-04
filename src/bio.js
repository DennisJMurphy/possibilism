// needs to be class based
import React from "react";
class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: "read",
        };
    }
    render() {
        if (this.state.editMode === "read") {
            return <h1>User Bio</h1>;
        } else if (this.state.editmode === "edit") {
            return (
                <div>
                    <textarea defaultValue="hello :)"></textarea>
                </div>
            );
        }
    }
}

export default BioEditor;

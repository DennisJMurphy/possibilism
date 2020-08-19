import React, { useState, useEffect } from "react";
import axios from "./axios";
//import { useDispatch, useSelector } from "react-redux";

export default function Project_Registration() {
    const [projectInfo, setProjectInfo] = useState();
    //setProjectInfo({});
    const handleChange = (e) => {
        setProjectInfo(e.target.value);
    };
    function click() {
        console.log("project info from register", projectInfo);
        axios
            .post("/register-project", {
                name: projectInfo.name,
                category: projectInfo.category,
                summary: projectInfo.summary,
                primary_metric_desc: projectInfo.primary_metric_desc,
            })
            .then(({ data }) => {
                console.log("data", data);
            });
    }
    return (
        <React.Fragment>
            <h2>Please enter your project details.</h2>
            {/* {this.state.error && (
                <div className="error">
                    {" "}
                    Something went wrong, try again.
                </div>
            )} */}
            <div className="project-registration">
                <input
                    onChange={(e) => handleChange(e)}
                    name="name"
                    placeholder="Project Name"
                />
                <input
                    onChange={(e) => handleChange(e)}
                    name="category"
                    placeholder="Category"
                />
                <input
                    onChange={(e) => handleChange(e)}
                    name="summary"
                    placeholder="Summary"
                />
                <input
                    onChange={(e) => handleChange(e)}
                    name="primary_metric_desc"
                    placeholder="Primary Success Metric"
                />
                <button onClick={(e) => click()}>Register Project</button>
            </div>
        </React.Fragment>
    );
}
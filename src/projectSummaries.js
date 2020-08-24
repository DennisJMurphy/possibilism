import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";

export default function ProjectSummaries() {
    const [projects, setProjects] = useState([]);
    const [loggedIn, setLoggedIn] = useState();
    const [update, setUpdate] = useState();
    let entryField = useRef();
    const handleChange = (e) => {
        const { value } = e.target;
        setUpdate(value);
    };
    function submit(id) {
        entryField.current.value = "";
        //console.log("id, update", id, update);
        axios
            .post("/update-metric", {
                project: id,
                value: update,
                //old: old,
            })
            .then(({ data }) => {
                //entryField.current.value = "";
                setProjects(data);

                //console.log("entryfield", entryField);
                //console.log("data", data);

                return;
            });
    }
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/current-projects");
                setProjects(data);
            } catch (err) {
                console.log("axios error get projects", err);
            }
            try {
                const cookie = await axios.get("/cookie");
                setLoggedIn(cookie.data.loggedIn);
                //setLoggedIn(cookie.data);
            } catch (err) {
                console.log("axios error get cookie", err);
            }
        })();
    }, []);

    //console.log("projects in project summaries2", projects);
    return (
        <React.Fragment>
            <h1>Project Dashboard</h1>
            {projects &&
                projects.map((project, id) => (
                    <div key={id} className="dashboard">
                        <h2>{project.name}</h2>
                        <p>
                            Status: {project.primary_metric}{" "}
                            {project.primary_metric_desc}!
                        </p>
                        <div>
                            {loggedIn && (
                                <div>
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        name="metric"
                                        placeholder="Enter Update Here"
                                        type="integer"
                                        ref={entryField}
                                    />
                                    <button onClick={(e) => submit(project.id)}>
                                        update
                                    </button>
                                </div>
                            )}
                        </div>
                        <p>{project.category}</p>

                        <p>
                            Project submitted by: {project.first} {project.last}
                        </p>
                        <p>{project.summary}</p>
                        <p>{project.resources}</p>
                    </div>
                ))}
        </React.Fragment>
    );
}

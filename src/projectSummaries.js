import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function ProjectSummaries() {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/current-projects");
                setProjects(data);
                //console.log("data in project summaries", data);
            } catch (err) {
                console.log("axios error get projects", err);
            }
        })();
    }, []);
    //console.log("projects in project summaries2", projects);
    return (
        <React.Fragment>
            <h1>Current Projects</h1>
            {projects &&
                projects.map((project, id) => (
                    <div key={id}>
                        <p>{project.name}</p>
                        <p>
                            {project.first}
                            {project.last}
                        </p>
                        <p>{project.category}</p>
                        <p>{project.summary}</p>
                        <p>
                            Status: {project.primary_metric}{" "}
                            {project.primary_metric_desc}!
                        </p>
                    </div>
                ))}
        </React.Fragment>
    );
}

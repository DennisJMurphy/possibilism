import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
export default function RegisteredProjects() {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/user-projects");
                setProjects(data);
                //console.log("data2 for projects", data2);
            } catch (err) {
                console.log("axios error get user projects", err);
            }
        })();
    }, []);

    return (
        <React.Fragment>
            <h4>Submitted Projects:</h4>
            {projects &&
                projects.map((project, ts) => (
                    <div key={project.ts} className="personal-stats">
                        <p>
                            {project.name} : {project.category}
                        </p>
                        <p>
                            The {project.name} Team reports:{" "}
                            {project.primary_metric}{" "}
                            {project.primary_metric_desc}
                        </p>
                    </div>
                ))}
        </React.Fragment>
    );
}

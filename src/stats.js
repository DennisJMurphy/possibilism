import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
export default function Stats() {
    const [stats, setStats] = useState([]);
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/user-updates");
                setStats(data);
            } catch (err) {
                console.log("axios error get user updates", err);
            }
            try {
                const { data2 } = await axios.get("/user-projects");
                setProjects(data2);
            } catch (err) {
                console.log("axios error get user projects", err);
            }
        })();
    }, []);
    //console.log("projects", projects);
    // projects are still not showing up, start here
    return (
        <React.Fragment>
            <h1>Participation</h1>
            {projects &&
                projects.map((project, ts) => (
                    <div key={project.ts} className="personal-stats">
                        <p>
                            {project.name} : {project.category}
                        </p>
                    </div>
                ))}
            {stats &&
                stats.map((stat, ts) => (
                    <div key={stat.ts} className="personal-stats">
                        <p>
                            {stat.name} : {stat.amount}{" "}
                            {stat.primary_metric_desc}! Timestamp: {stat.ts}
                        </p>

                        <p>{stat.category}</p>
                    </div>
                ))}
        </React.Fragment>
    );
}

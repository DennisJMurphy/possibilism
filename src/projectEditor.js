import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
export default function ProjectEditor() {
    const [stats, setStats] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/user-updates");
                setStats(data);
            } catch (err) {
                console.log("axios error get user updates", err);
            }
        })();
    }, []);
    //console.log("stats", stats);
    return (
        <React.Fragment>
            <h1>Participation</h1>
            {stats &&
                stats.map((stat, ts) => (
                    <div key={stat.ts} className="personal-stats">
                        <p>
                            {stat.name} {stat.ts}: {stat.amount}{" "}
                            {stat.primary_metric_desc}!
                        </p>

                        <p>{stat.category}</p>

                        {/* <p>
                            Project submitted by: {project.first} {project.last}
                        </p>
                        <p>{project.summary}</p>  */}
                    </div>
                ))}
        </React.Fragment>
    );
}

import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
export default function Stats() {
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

    return (
        <React.Fragment>
            <h1>Participation</h1>
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

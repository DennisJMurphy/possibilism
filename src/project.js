import React, { useState, useEffect } from "react";
import Project_Registration from "./project_register";
import ProjectSummaries from "./projectSummaries";

export default function Projects() {
    return (
        <React.Fragment>
            <ProjectSummaries />
            <Project_Registration />
        </React.Fragment>
    );
}

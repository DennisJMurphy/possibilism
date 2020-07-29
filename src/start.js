import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

function HelloWorld() {
    return <div>do I need to restart the server?</div>;
}

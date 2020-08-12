import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
//import Registration from "./register";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import App from "./app"; // no curly brackets if it's a default

let elem;

let isLoggedIn; //= null;
if (location.pathname === "/welcome") {
    isLoggedIn = false;
} else {
    isLoggedIn = true;
}
//console.log("isloggedin, start.js", isLoggedIn);
if (isLoggedIn == false) {
    elem = <Welcome />;
} else {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    init(store);
}

ReactDOM.render(elem, document.querySelector("main"));

// let component;
// if (location.pathname === "/welcome") {
//     component = <Welcome />;
// } else {
//     component = (
//         <Provider store={store}>
//             <App />
//         </Provider>
//     );
// }

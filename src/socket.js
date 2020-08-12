import * as io from "socket.io-client";
//import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
    }
};
// prevents multiple connections to one client
// function is getting passed the store, so the dispatch action is available
// need to create 2 actions and 2 conditionals in the reducer
// state will have friendswannabes:[] and chatMessages:[]

import { chatMessages } from "./actions";

export default function reducer(state = {}, action) {
    //console.log("action in reducer", action);
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        //console.log("action friendswannabes reducer", action.friendsWannabes);
        return Object.assign({}, state, {
            friendsWannabes: action.friendsWannabes,
        });
    }

    if (action.type == "ACCEPTF") {
        //console.log("action.other.id", action.otherId);
        //if the id doesn't match the action.newFriend?
        return Object.assign({}, state, {
            friendsWannabes: state.friendsWannabes.map((id) => {
                if (id.id != action.otherId) {
                    return id;
                } else {
                    return { ...id, accepted: true };
                }
            }),
        });
    }
    if (action.type == "END_FRIENDSHIP") {
        //console.log("action.other.id", action.otherId);
        //if the id doesn't match the action.newFriend?
        return Object.assign({}, state, {
            friendsWannabes: state.friendsWannabes.filter(
                (id) => id.id !== action.otherId
            ),
        });
    }
    if (action.type == "GET_CHAT_MESSAGES") {
        return Object.assign({}, state, {
            chatMessages: action.chatMessages,
        });
    }
    //console.log("state get chat messages", state.chatMessages);
    if (action.type == "ADD_CHAT_MESSAGE") {
        //console.log("action data reducer", action.newMessage);
        //let newState = [...state.chatMessages, action.chatMessages];
        //console.log("newState", newState);
        return Object.assign({}, state, {
            chatMessages: [...state.chatMessages, action.newMessage],
        });
    }
    ///console.log("chatMessages after", state.chatMessages);
    return state;
}
// return Object.assign({}, state, {
//     friendsWannabes: action.friendsWannabes,
// });

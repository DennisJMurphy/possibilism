export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        //console.log("action friendswannabes reducer", action.friendsWannabes);
        return Object.assign({}, state, {
            friendsWannabes: action.friendsWannabes,
        });
    }

    return state;
}

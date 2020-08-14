import axios from "./axios";
export async function receiveFriendsWannabes() {
    try {
        const { data } = await axios.get("/friends-wannabes");
        //console.log("users in friendlist", data);
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            friendsWannabes: data,
        };
        //setUsers(data);
    } catch (err) {
        console.log("axios error get friends", err);
    }
}
export async function acceptFriendship(otherId) {
    try {
        const { data } = await axios.post(`/add-friend/${otherId}`);
        console.log("ather d", otherId);
        console.log("data from action", data); // success: true, so what?
        if (data.success) {
            return {
                type: "ACCEPTF",
                otherId,
            };
        }
    } catch (err) {
        console.log("axios error get friends", err);
    }
}
export async function endFriendship(otherId) {
    try {
        const { data } = await axios.post(`/remove-row/${otherId}`);
        if (data.success) {
            return {
                type: "END_FRIENDSHIP",
                otherId,
            };
        }
    } catch (err) {
        console.log("axios error end friendship", err);
    }
}
export async function chatMessages(data) {
    //console.log("actionsdata", data);
    return {
        type: "GET_CHAT_MESSAGES",
        chatMessages: data,
    };
    //setUsers(data);
}

import axios from "./axios";
export async function receiveFriendsWannabes() {
    try {
        const { data } = await axios.get("/friends-wannabes");
        console.log("users in friendlist", data);
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
        return {
            type: "ACCEPT_FRIENDSHIP",
            newFriend: data,
        };
    } catch (err) {
        console.log("axios error get friends", err);
    }
}
export async function endFriendship(otherId) {
    try {
        const { data } = await axios.post(`/remove-row/${otherId}`);
        return {
            type: "END_FRIENDSHIP",
            exFriend: data,
        };
    } catch (err) {
        console.log("axios error end friendship", err);
    }
}

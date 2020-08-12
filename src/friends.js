import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendButton from "./friendButton";
import {
    receiveFriendsWannabes,
    acceptFriendship,
    endFriendship,
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);
    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((keepers) => keepers.accepted)
    );
    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((keepers) => !keepers.accepted)
    );
    console.log("friends", friends);
    return (
        <>
            <h1>Friends and Wannabes</h1>
            <h1>Friends</h1>
            <div className="frendz">
                {friends &&
                    friends.map((user, id) => (
                        <div key={id}>
                            <img src={user.profile_pic} className="friends" />
                            <p>
                                {user.first} {user.last}
                            </p>
                            <button
                                onClick={() => dispatch(endFriendship(user.id))}
                            >
                                unfriend
                            </button>
                        </div>
                    ))}
            </div>
            <h1>Wannabes</h1>
            <div className="frendz">
                {wannabes &&
                    wannabes.map((user, id) => (
                        <div key={id}>
                            <img src={user.profile_pic} className="friends" />
                            <p>
                                {user.first} {user.last}
                            </p>
                            <button
                                onClick={() =>
                                    dispatch(acceptFriendship(user.id))
                                }
                            >
                                accept
                            </button>
                            <button
                                onClick={() => dispatch(endFriendship(user.id))}
                            >
                                reject
                            </button>
                        </div>
                    ))}
            </div>
        </>
    );
}
//const [users, setUsers] = useState([]);
//useEffect(() => {
// (async () => {
// try { noooooo,  dispatch an action!
//     const { data } = await axios.get("/friends");
//     console.log("users in find people", data);
//     setUsers(data);
// } catch (err) {
//     console.log("axios error findPeople", err);
// }
//  })();
// }, []);

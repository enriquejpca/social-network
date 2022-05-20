import { useDispatch, useSelector } from "react-redux";
// import your action creators here!
import { useEffect } from "react";
import {
    makeFriend,
    receiveFriends,
    deleteFriends,
} from "./redux/friends/slice";

export default function FriendsAndWannabees() {
    // This gives you access to the dispatch function
    const dispatch = useDispatch();

    // You are selecting Wannabees from the global state
    // before you target a property in state, make sure you know what it looks like!
    const wannabees = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => !friendship.accepted)
    );

    //console.log("wannabees: ", wannabees);

    // Make sure you select your "friends" from state using useSelector
    const friends = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => friendship.accepted)
    );

    // When component mounts, get all friends and wannabees
    useEffect(() => {
        // STEP 1 - make a GET request using fetch to retrieve the friends and wannabees
        // STEP 2 - once you have that data back, call dispatch and pass it an action to add this data to redux
        // you'll need to create and import the action creator below
        fetch("/friends-wannabeess")
            .then((res) => res.json())
            .then((data) => {
                console.log("data: ", data[0]);
                dispatch(receiveFriends(data));
            })
            .catch((err) => {
                console.log("Error fetching friends: ", err);
            });
    }, []);

    const handleCancel = (id) => {
        // STEP 1 - make a POST request to update the DB
        fetch("/delete-friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        })
            .then((res) => res.json())
            // STEP 2 - dispatch an action to update the global state
            .then(() => {
                dispatch(deleteFriends(id));
            })
            .catch((err) => {
                console.log("Error deleting friends: ", err);
            });

        // you'll need to create and import the action creator below
    };
    const handleAccept = (id) => {
        // STEP 1 - make a POST request to update the DB
        fetch("/accept-wannabees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        })
            .then((res) => res.json())
            // STEP 2 - dispatch an action to update the global state
            .then(() => {
                dispatch(makeFriend(id));
            })
            .catch((err) => {
                console.log("Error making friends: ", err);
            });

        // you'll need to create and import the action creator below
    };

    return (
        <section>
            <h1>FRIENDS</h1>
            {friends.map((friend) => {
                return (
                    <div key={friend.id} className="friends-container">
                        <img
                            src={friend.profile_photo}
                            className="friend-profile-photo"
                        />
                        <p>
                            {friend.first} {friend.last}
                        </p>

                        <button onClick={() => handleCancel(friend.id)}>
                            Unfriend
                        </button>
                    </div>
                );
            })}

            <h1>WANNABEES</h1>
            {wannabees.map((wannabee) => {
                return (
                    <div key={wannabee.id} className="wannabees-container">
                        <img
                            src={wannabee.profile_photo}
                            className="wannabees-profile-photo"
                        />
                        <p>
                            {wannabee.first} {wannabee.last}
                        </p>

                        <button onClick={() => handleAccept(wannabee.id)}>
                            Accept
                        </button>
                    </div>
                );
            })}
        </section>
    );
}

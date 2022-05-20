// redux/friends-wannabees/slice.js
// this is our friends-wannabees sub-reducer
// in here- we MUST make copies for every array and object
// no mutating allowed!

export default function friendsWannabeesReducer(friends = [], action) {
    if (action.type === "friends-wannabees/receive") {
        //console.log("payload receive", action.payload);
        return (friends = action.payload);
    } else if (action.type === "friends-wannabees/accept") {
        console.log("payload accept: ", action.payload.id);
        friends = friends.map((friend) => {
            if (friend.id == action.payload.id) {
                friend = { ...friend, accepted: true };
            }
            return friend;
        });
    } else if (action.type === "friends-wannabees/unfriend") {
        console.log("payload unfriend: ", action.payload.id);
        friends = friends.filter((friend) => {
            if (friend.id != action.payload.id) {
                return friend;
            }
        });
    }
    return friends;
}

// ACTIONS!

export function receiveFriends(data) {
    //console.log("Inside of receiveFriends", data);
    return {
        type: "friends-wannabees/receive",
        payload: data,
    };
}

export function makeFriend(id) {
    console.log("Inside of makeFriend", id);
    return {
        type: "friends-wannabees/accept",
        payload: { id },
    };
}

export function deleteFriends(id) {
    console.log("Inside of deleteFriends", id);
    return {
        type: "friends-wannabees/unfriend",
        payload: { id },
    };
}

// var obj = {
//     name: "Andrea",
// };

//#1 - the spread operator (works for objects and arrays!)

// var newObj = { ...obj };
// var coolObj = { ...obj, breed: "Bichon" };

// var arr = [1, 2, 3];
// var newArr = [...arr];
// var coolArr = [...arr, 4, 5];

//#2 - MAP - works only on arrays.
//useful for cloning, looping and changing each element in the array. This is a loop that by default return a new array.

//#3 - FILTER - works only on arrays!
//amazing for removing things from an array!
//this is also a lopp that creates

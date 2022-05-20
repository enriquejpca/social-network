// exports.addFriendRequest = (myId, otherUserId) => {
//     return db.query(
//         `INSERT INTO friendships (sender_id, recipient_id, accepted)
//         VALUES ($1, $2, false)`,
//         [myId, otherUserId]
//     );
// };

// exports.acceptFriendRequest = (myId, otherUserId) => {
//     return db.query(
//         `UPDATE friendships SET accepted = true
//             WHERE sender_id = $2 AND recipient_id = $1;`,
//         [myId, otherUserId]
//     );
// };

// exports.deleteFriendship = (myId, otherUserId) => {
//     return db.query(
//         `DELETE FROM friendships
//             WHERE (sender_id = $1 AND recipient_id = $2)
//             OR (sender_id = $2 AND recipient_id = $1);`,
//         [myId, otherUserId]
//     );
// };

// app.post("/api/friendship-status", function (req, res) {
//     const { otherUserId, action } = req.body;

//     if (action === "Send friend Request") {
//         db.addFriendRequest(req.session.userId, otherUserId)
//             .then(() => {
//                 res.json("Cancel friend Request");
//             })
//             .catch((err) => {
//                 console.log("err adding friend request", err);
//             });
//     } else if (action === "Accept friend request") {
//         db.acceptFriendRequest(req.session.userId, otherUserId)
//             .then(() => {
//                 res.json("Unfriend");
//             })
//             .catch((err) => {
//                 console.log("err updating friend request", err);
//             });
//     } else if (action === "Cancel friend request" || action === "Unfriend") {
//         db.deleteFriendship(req.session.userId, otherUserId)
//             .then(() => {
//                 res.json("Send Friend Request");
//             })
//             .catch((err) => {
//                 console.log("err deleting friendship", err);
//             });
//     }
// });

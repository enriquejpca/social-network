const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnetwork`
);

exports.getRegistration = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [first, last, email, password]
    );
};

exports.getUserByMail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

exports.codeForTheChangeOfPassword = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING *`,
        [email, code]
    );
};

exports.getCode = () => {
    return db.query(
        `SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes';`
    );
};

exports.updateNewPassword = (email, hashedPassword) => {
    return db.query(
        `UPDATE users
        SET password = $2
        WHERE email = $1`,
        [email, hashedPassword]
    );
};

exports.changeProfilePhoto = (id, profile_photo) => {
    return db.query(
        `UPDATE users
        SET profile_photo = $2
        WHERE users.id = $1 RETURNING profile_photo`,
        [id, profile_photo]
    );
};

exports.getUserInfo = (userId) => {
    return db.query(
        `SELECT id, first, last, profile_photo, bio 
        FROM users 
        WHERE id=$1`,
        [userId]
    );
};

exports.updateBio = (userId, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING bio`,
        [userId, bio]
    );
};

exports.getRecentUsers = () => {
    return db.query(
        `SELECT id, first, last, profile_photo, bio FROM users
        ORDER BY id 
        LIMIT 3`
    );
};

exports.getMatchingUsers = (searchTerm) => {
    return db.query(
        `SELECT id, first, last, profile_photo, bio FROM users
        WHERE first ILIKE $1`,
        [searchTerm + "%"]
    );
};

exports.getOtherUsers = (id) => {
    return db.query(
        `SELECT id, first, last, profile_photo, bio FROM users 
        WHERE id=$1`,
        [id]
    );
};

exports.getFriendshipStatus = (myId, otherUserId) => {
    return db.query(
        `SELECT * FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1);`,
        [myId, otherUserId]
    );
};

exports.addFriendRequest = (myId, otherUserId) => {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)`,
        [myId, otherUserId]
    );
};

exports.acceptFriendRequest = (myId, otherUserId) => {
    return db.query(
        `UPDATE friendships SET accepted = true
            WHERE sender_id = $2 AND recipient_id = $1 RETURNING sender_id, recipient_id, accepted`,
        [myId, otherUserId]
    );
};

exports.deleteFriendship = (myId, otherUserId) => {
    return db.query(
        `DELETE FROM friendships
            WHERE (sender_id = $2 AND recipient_id = $1)
            OR (sender_id = $1 AND recipient_id = $2);`,
        [myId, otherUserId]
    );
};

exports.retrieveAllFriendsAndWannaBees = (id) => {
    return db.query(
        `
    SELECT users.id, first, last, profile_photo, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

exports.getAllMessages = () => {
    return db.query(`SELECT chats.id AS message_id, chats.user_id AS user_id, first, last, message
            FROM chats
            JOIN users
            ON chats.user_id = users.id
            ORDER BY chats.id DESC
            LIMIT 10`);
};

exports.insertOneMessage = (message, id) => {
    return db.query(
        "INSERT INTO chats (message, user_id) VALUES ($1, $2) RETURNING *",
        [message, id]
    );
};

exports.insertComment = (comment, id) => {
    return db.query(
        `INSERT INTO comments(comment, user_id) VALUES($1, $2)RETURNING *`,
        [comment, id]
    );
};

// exports.getUserInformation = (id) => {
//     return db.query(
//         `SELECT first, last, url
//         FROM users
//         WHERE id=$1`,
//         [id]
//     );
// };

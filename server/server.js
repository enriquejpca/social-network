const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("/Users/manrish 1/Desktop/truffle-socialnetwork/db.js");
const { hash, compare } = require("./bcrypt");
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const { uploader } = require("./upload");
const { upload } = require("./s3");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const secret =
    process.env.SESSION_SECRET ||
    require("../server/secrets.json").SESSION_SECRET;

const cookieSessionMiddleware = cookieSession({
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
    // HARDCODED EXAMPLES OF WHAT THE RESPONSE COULD LOOK LIKE IF WE RAN THE CODE ABOVE
    // AND HAD SET UP OUR MIDDLEWARE FOR COOKIES!!!! -> session stuff from petition ;)
    // if there is no cookie out browser would receive this as a reponse
    // res.json({
    //     userId: undefined,
    // });
    // If there were a cookie, our respone would look sth like this
    // res.json({
    //     userId: 5,
    // });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.post("/register.json", (req, res) => {
    const { first, last, email, password } = req.body;
    // console.log("req.body: ", req.body);
    hash(password)
        .then((hashedPassword) => {
            //console.log("hashed password: ", hashedPassword);
            //console.log("first: ", first);
            //console.log("last: ", last);
            //console.log("email: ", email);
            // Store users first and last names, email and the hashed password in the database.
            db.getRegistration(first, last, email, hashedPassword)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.json({ success: true });
                    console.log("Hecho!");
                })
                .catch((err) => {
                    console.log("error hashing password", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error submitting registration values", err);
            res.json({ success: false });
        });
});

app.post("/login.json", (req, res) => {
    const { email, password: passwordInserted } = req.body;
    console.log("email", email);
    //console.log("password: passwordInserted", passwordInserted);
    //console.log("Req.body: ", req.body);
    db.getUserByMail(email)
        .then((results) => {
            const { userId, password: passwordDb } = results.rows[0];
            //console.log("results from the data base: ", results.rows[0]);
            compare(passwordInserted, passwordDb)
                .then((match) => {
                    if (match) {
                        console.log(
                            "Does the password match the one stored",
                            match
                        );
                        req.session.userId = results.rows[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error submitting registration values", err);
        });
});

app.post("/reset/start", (req, res) => {
    //const { email } = req.body;
    //console.log("email: ", email);
    //console.log("Req.body: ", req.body);
    //console.log("Req.body.email: ", req.body.email);
    db.getUserByMail(req.body.email)
        .then(({ rows }) => {
            console.log("Results.rows.length: ", rows.length);
            if (rows.length == 0) {
                console.log("The user does not exist");
                res.json({ success: false });
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.codeForTheChangeOfPassword(req.body.email, secretCode)
                    .then(() => {
                        ses.sendEmail(
                            `Please use the following code to reset your password ${secretCode}`
                        );
                    })
                    .then(() => res.json({ success: true }));
            }
        })
        .catch((err) => {
            console.log("error", err);
            res.json({ success: false });
        });
});

app.post("/reset/verify", (req, res) => {
    //const { req.body.email, reqcode, newPassword } = req.body;
    console.log("Req.body.email: ", req.body.email);
    console.log("Req.body.code", req.body.code);
    console.log("Req.body.newpassword", req.body.password);
    db.getCode(req.body.email)
        .then(({ rows }) => {
            //console.log("Req.body.email: ", rows[0].email);
            //console.log("Req.body.email: ", req.body.email);

            for (let i = 0; i < rows.length; i++) {
                if (rows[i].code == req.body.code) {
                    console.log("Correct code");
                    hash(req.body.password)
                        .then((hashedPassword) => {
                            db.updateNewPassword(
                                req.body.email,
                                hashedPassword
                            );
                        })
                        .then(() => {
                            res.json({ success: true });
                        });
                    return;
                }
            }
        })
        .catch((err) => {
            console.log("error with the verification", err);
            res.json({ success: false });
        });
});

app.post("/upload", uploader.single("file"), upload, (req, res) => {
    console.log("Req.file: ", req.file);
    if (req.file) {
        let url = `https://s3.amazonaws.com/buckerybucket/${req.file.filename}`;
        console.log("fullUrl: ", url);
        db.changeProfilePhoto(req.session.userId, url)
            .then(({ rows }) => {
                console.log("change profile_photo: ", rows);
                res.json(rows);
            })
            .catch((err) => {
                console.log(err);
                res.json({ success: false });
            });
    }
});

app.get("/user", (req, res) => {
    console.log("Req.session.userId: ", req.session.userId);
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            res.json({ success: true, rows });
            //console.log("Rows: ", rows);
        })
        .catch((err) => {
            console.log(err);
            res.json({ success: false });
        });
});

app.post("/bio", (req, res) => {
    //console.log("Req.body", req.body);
    console.log("Req.body.draftBio: ", req.body.draftBio);
    db.updateBio(req.session.userId, req.body.draftBio)
        .then((result) => {
            console.log("Result: ", result.rows);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error adding bio to database: ", err);
        });
});

app.get("/userss", (req, res) => {
    db.getRecentUsers().then(({ rows }) => {
        //console.log("Rows of recent users: ", rows);
        res.json(rows);
    });
});

app.get("/userss/:search", (req, res) => {
    console.log("Req.params.search: ", req.params.search);
    db.getMatchingUsers(req.params.search).then(({ rows }) => {
        //console.log("Rows of searched users: ", rows);
        res.json(rows);
    });
});

app.get("/userss/profile/:id", (req, res) => {
    db.getOtherUsers(req.params.id)
        .then(({ rows }) => {
            //console.log("user's data: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error getting user data: ", err);
        });
});

app.get("/friendship/:otherUserId", (req, res) => {
    //console.log("userId", req.session.userId);
    console.log("otherUserId here", parseInt(req.params.otherUserId));
    // const { otherUserId } = req.body;
    // console.log("otherUserId: ", otherUserId);

    db.getFriendshipStatus(req.session.userId, parseInt(req.params.otherUserId))
        .then(({ rows }) => {
            console.log("hello");
            console.log("Friendships status: ", rows);
            res.json({ rows });
        })
        .catch((err) => {
            console.log("Error getting the frienship status: ", err);
        });
});

app.post("/api/friendship-status", function (req, res) {
    const { otherUserId, action } = req.body;
    console.log("Req.body", req.body);

    if (action === "Send friend request") {
        console.log("Inside send friend request if statement");
        db.addFriendRequest(req.session.userId, otherUserId)
            .then(() => {
                res.json("Cancel friend Request");
            })
            .catch((err) => {
                console.log("Err sending friend request", err);
            });
    } else if (action === "Accept friend request") {
        console.log("Inside accept friend request else if statement");
        db.acceptFriendRequest(req.session.userId, otherUserId)
            .then(() => {
                res.json("Unfriend");
                console.log("Friendship was accepted");
            })
            .catch((err) => {
                console.log("err accepting friend request", err);
            });
    } else if (action === "Cancel friend request" || action === "Unfriend") {
        console.log(
            "Inside cancel friend request and unfriend else if statement"
        );
        db.deleteFriendship(req.session.userId, otherUserId)
            .then(() => {
                res.json("Send Friend Request");
            })
            .catch((err) => {
                console.log("err canceling friendship", err);
            });
    }
});

app.get("/friends-wannabeess", (req, res) => {
    console.log("Inside of getting friends-wannabees");
    db.retrieveAllFriendsAndWannaBees(req.session.userId)
        .then(({ rows }) => {
            console.log("Rows in friends-wannabees: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error retrieving all friends and wannabees: ", err);
        });
});

app.post("/accept-wannabees", (req, res) => {
    //console.log("Inside of Post friends-wannabees");
    const { id } = req.body;
    console.log("Req.body in accept-wannabees", id, req.session.userId);
    db.acceptFriendRequest(req.session.userId, id)
        .then(({ rows }) => {
            console.log("Success updating database", rows);
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Error updating the database: ", err);
        });
});

app.post("/delete-friends", (req, res) => {
    const { id } = req.body;
    console.log("id", id);
    db.deleteFriendship(req.session.userId, id)
        .then(() => {
            console.log("Success deleting friendship");
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Error deleting friendships: ", err);
        });
});

app.post("/comment", (req, res) => {
    console.log("Req.body of the comments: ", req.body);
    console.log("req.body.draftComment: ", req.body.draftComment);
    db.insertComment(req.body.draftComment, req.session.userId)
        .then(({ rows }) => {
            console.log("Rows of the comment: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error adding the comment to the database", err);
        });
});

//This one is the last route. All data routes need to come beforehand.
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

let onlineUsers = [];

io.on("connection", function (socket) {
    console.log("Connection");

    const userId = socket.request.session.userId;
    console.log("userId", userId);

    onlineUsers.push(userId);

    if (userId) {
        db.getAllMessages().then(({ rows }) => {
            socket.emit("last-10-messages", {
                messages: rows,
            });
        });

        socket.on("message", (data) => {
            console.log("data", data);
            console.log("UserId adding a message: ", userId);

            //console.log("message: ", messages);
            db.insertOneMessage(data.message, userId).then(({ rows }) => {
                db.getAllMessages(userId).then(({ rows: data }) => {
                    console.log(data);
                    io.emit("message", { ...rows[0], ...data[0] });
                });
            });
        });
    } else if (!userId) {
        return socket.disconnect(true);
    }
});

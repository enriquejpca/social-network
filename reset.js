

app.post("/password/reset/start", (req, res) => {
    //const { email } = req.body;
    //console.log("email: ", email);
    //console.log("Req.body: ", req.body);
    //console.log("Req.body.email: ", req.body.email);
    db.getUserByMail(req.body.email)
        .then((results) => {
            console.log("Results.rows.length: ", results.rows);
            if (results.rows.length != 0) {
                console.log("The user does not exist");
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

app.post("/password/reset/verify", (req, res) => {
    console.log("Req.body.code", req.body.code);
    console.log("Req.body.newpassword", req.body.password);
    db.getCode()
        .then(({ rows }) => {
            console.log(rows[0].email);
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].code == req.body.code) {
                    console.log("Correct code");
                    hash(req.body.password)
                        .then((hashedPassword) => {
                            db.updateNewPassword(
                                req.session.userId,
                                hashedPassword
                            );
                        })
                        .then(() => {
                            res.json({ success: true });
                        });
                }
            }
        })
        .catch((err) => {
            console.log("error with the verification", err);
            res.json({ success: false });
        });
});
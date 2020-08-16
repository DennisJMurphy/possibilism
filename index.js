const express = require("express");
const app = express();
const compression = require("compression");
const server = require("http").Server(app); // raw node server for socket.io
const io = require("socket.io")(server, { origins: "localhost:8080" }); // add heroku here if needed
const db = require("./db"); // adding .js is optional
const ses = require("./ses");
const cookieSession = require("cookie-session");
// new cookiesession middleware for io
const cookieSessionMiddleware = cookieSession({
    secret: `There is still no need for alarm.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// app.use( // redundant
//     cookieSession({
//         secret: `There is no need for alarm.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );
const s3 = require("./s3");
//const { s3Url } = require("./config");
const { hash, compare } = require("./bc");
app.use(express.static("public"));
app.use(express.json());
//app.use(express.urlencoded({extended: false,}));
app.use(compression());
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
const cryptoRandomString = require("crypto-random-string");
const secretCode = cryptoRandomString({
    length: 6,
});
//// file upload business top //////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
//const { diskStorage } = require("multer");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097157,
    },
});
//// file upload business bottom //////
const csurf = require("csurf");
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
////// end of initial setup and middleware/////

app.get("/", function (req, res) {
    //console.log("Cookie if any at '/': ", req.session.userId);
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/welcome", function (req, res) {
    //console.log("Welcome Route: cookie if any at/welcome", req.session.userId);
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.post("/resetpassword", (req, res) => {
    var email = req.body.email;
    var step = req.body.step;
    var input = req.body.code;
    var password = req.body.password;
    //console.log("step:", step);
    if (step == 1) {
        //console.log("email", email);
        db.getId(email)
            .then((result) => {
                //console.log("results", result.rows[0]);
                if (result.rowCount == 0) {
                    res.json({ success: false });
                } else {
                    var code = secretCode;
                    db.setCode(email, code)
                        .then(() => {
                            ses.sendEmail(email, code, "Password Reset")
                                .then(() => {
                                    res.json({
                                        success: true,
                                        email: email,
                                        step: 2,
                                    });
                                })
                                .catch((err) => {
                                    console.log("err in post sendEmail", err);
                                    res.json({ success: false });
                                });
                        })
                        .catch((err) => {
                            console.log("err in post setCode", err);
                            res.json({ success: false });
                        });
                }
            })
            .catch((err) => {
                console.log("err in post getId", err);
                res.json({ success: false });
            });
    } else if (step == 2) {
        //console.log("the things", email, input, password);
        db.getCode()
            .then((codes) => {
                // console.log(
                //     "the input and the stored code",
                //     input,
                //     codes.rows[0].code
                // );
                if (codes.rowcount == 0) {
                    res.json({ success: false });
                } else if (input == codes.rows[0].code) {
                    //console.log("THE CODES MATCH");
                    hash(password)
                        .then((result) => {
                            db.updatePass(email, result)
                                .then((success) => {
                                    res.json({ success: true, step: 3 });
                                })
                                .catch((err) => {
                                    console.log("err in post updatePass", err);
                                    res.json({ success: false });
                                });
                        })
                        .catch((err) => {
                            console.log("err in post hash", err);
                            res.json({ success: false });
                        });
                }
            })
            .catch((err) => {
                console.log("err in post getCode", err);
                res.json({ success: false });
            });
    } else {
        console.log("This else should not ever be in the console.");
    }
});
app.post("/login", (req, res) => {
    //console.log("credentials", req.body.email, req.body.password);
    var passEntered = req.body.password;
    db.getPass(req.body.email)
        .then((result) => {
            //console.log("result", result);
            var tempId = result.rows[0].id;
            var passStored = result.rows[0].password;
            //console.log("stored pass hash", passStored);
            compare(passEntered, passStored)
                .then((result) => {
                    if (result == true) {
                        req.session.userId = tempId;
                        //console.log("password correct!");
                        res.json({ success: true });
                    } else {
                        //console.log("password incorrect!");
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("err in post /login", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err in post /login DB", err);
            res.json({ success: false });
        });
});

app.post("/register", (req, res) => {
    //console.log("req.body", req.body);
    hash(req.body.guard)
        .then((result) => {
            var hashPass = result;
            db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashPass
            )
                .then((result) => {
                    req.session.userId = result.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    res.json({ success: false });
                    console.log("1err in post /add", err);
                    return;
                });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("2err in post /add", err);
            return;
        });
});
app.get("/user", (req, res) => {
    var userId = req.session.userId;
    db.userData(userId)
        .then((data) => {
            //console.log("/userdata", data.rows[0]);
            let { id, first, last, email, bio, profile_pic } = data.rows[0];
            if (bio === undefined) {
                bio = "";
            }
            res.json({ id, first, last, email, bio, profile_pic });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in get/user", err);
            return;
        });
});
app.get("/other-user/:id", (req, res) => {
    //console.log("params", req.params);
    if (req.params.id == req.session.userId) {
        res.json({ sameUser: true });
    } else {
        db.otherUser(req.params.id)
            .then((data) => {
                const { first, last, bio, profile_pic, email } = data.rows[0];
                res.json({ first, last, bio, email, profile_pic });
            })
            .catch((err) => {
                res.json({ success: false });
                console.log("err in get/otheruser", err);
                return;
            });
    }
});
app.post("/userbio", (req, res) => {
    var userId = req.session.userId;
    //console.log("req.body.bio, req.body", req.body.bio, req.body);
    db.updateBio(userId, req.body.bio)
        .then((data) => {
            //console.log("data rows bio", data.rows[0].bio);
            res.json({
                data: data.rows[0].bio,
                success: true,
            });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in post, userbio", err);
            return;
        });
});
app.get("/newUsers", (req, res) => {
    db.newUsers()
        .then((result) => {
            //console.log("db data", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in get/otheruser", err);
            return;
        });
});
app.get("/search/:userInput", (req, res) => {
    //console.log("req body userinput", req);
    if (req.params.userInput == " ") {
        console.log("aha, you didnt crash");
        return res.json({});
    }
    db.searchUsers(req.params.userInput)
        .then((result) => {
            //console.log("db search data", result.rows);
            return res.json(result.rows);
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in get/otheruser", err);
            return;
        });
});
app.get("/check-friend/:otherId", (req, res) => {
    var userId = req.session.userId;
    var otherId = req.params.otherId;
    //console.log("req.params", req.params.otherId);
    //console.log("userid, otherid", userId, otherId);
    db.checkFriend(otherId, userId)
        .then((result) => {
            if (result.rows.length == 0) {
                return res.json({ button: "make friendship request" });
            }
            var sender = result.rows[0].sender_id;
            //console.log("length", result.rows);

            if (result.rows[0].accepted == true) {
                return res.json({ button: "unfriend" });
            } else if (result.rows[0].accepted == false) {
                //console.log("sender, otherId", sender, otherId);
                if (sender == otherId) {
                    return res.json({ button: "accept invite" });
                } else {
                    return res.json({ button: "cancel invite" });
                }
            } else {
                res.json({ button: "leave the house" });
            }
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in get/checkfriend", err);
            return;
        });
});
app.post("/request/:otherId", (req, res) => {
    var userId = req.session.userId;
    var otherId = req.params.otherId;
    db.request(userId, otherId)
        .then((result) => {
            res.json({ success: true });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in post request", err);
            return;
        });
});
app.post("/add-friend/:otherId", (req, res) => {
    var userId = req.session.userId;
    var otherId = req.params.otherId;
    db.addFriend(userId, otherId)
        .then((result) => {
            res.json({ success: true });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in post add-friend", err);
            return;
        });
});
app.post("/logout-user", (req, res) => {
    req.session.userId = undefined;
    res.redirect("/");
});

app.post("/remove-row/:otherId", (req, res) => {
    var userId = req.session.userId;
    var otherId = req.params.otherId;
    db.removeRow(userId, otherId)
        .then((result) => {
            res.json({ success: true });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in post request", err);
            return;
        });
});
app.get("/friends-wannabes", (req, res) => {
    var userId = req.session.userId;
    db.getFrenebies(userId)
        .then((data) => {
            return res.json(data.rows);
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in get frenebies", err);
            return;
        });
});
app.post("/upload", uploader.single("profile_pic"), s3.upload, (req, res) => {
    var userId = req.session.userId;
    //req.file gets uploaded
    //console.log("req.file", req.file.filename);
    // req. body is the rest of the input fields
    if (req.file) {
        db.userData(userId).then((data) => {
            if (data.rows[0].profile_pic) {
                const profilePic = data.rows[0].profile_pic;
                const filename = profilePic.replace(
                    "https://s3.amazonaws.com/socialnetwork23/",
                    ""
                );
                s3.deletePic(filename);
            } else {
                console.log("no previous pic");
            }
        });
        var url =
            "https://s3.amazonaws.com/socialnetwork23/" + req.file.filename;
        //console.log("check db inputs, id and url", userId, url);
        // need to add a db insert here for all info
        db.updateImage(userId, url).then((newDbData) => {
            res.json({
                data: url,
                success: true,
            });
        });
    } else {
        res.json({
            success: false,
        });
    }
});
app.post("/delete-user", (req, res) => {
    var userId = req.session.userId;
    //removeUserFriends, removeUserChats, removeUser
    // delete photos from AWN, clear the chat object
    db.userData(userId).then((data) => {
        const profilePic = data.rows[0].profile_pic;
        const filename = profilePic.replace(
            "https://s3.amazonaws.com/socialnetwork23/",
            ""
        );
        //console.log("filename before deletepic", filename);
        s3.deletePic(filename);
        // .then((data) => {
        //     console.log("filename", filename);
        //     return data;
        // });
    });
    db.removeUserFriends(userId)
        .then(() => {
            db.removeUserChats(userId)
                .then(() => {
                    db.removeUser(userId)
                        .then(() => {
                            req.session = null;
                            res.redirect("/*");
                        })
                        .catch((err) => {
                            res.json({ success: false });
                            console.log("err in remove user", err);
                            return;
                        });
                })
                .catch((err) => {
                    res.json({ success: false });
                    console.log("err in removeUserChats", err);
                    return;
                });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("err in removeUserFriends", err);
            return;
        });
});

// get * must be the last route
// it ensures that the app will be running regardless of the url
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});
// changed the above from app.listen to server.listen for io.session
io.on("connection", async (socket) => {
    console.log(`socket wih the id ${socket.id} is now connected`);
    //console.log("socket.request.session", socket.request.session);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    socket.on("disconnect", function () {
        console.log(`socket wih the id ${socket.id} is now disconnected`);
    });
    const userId = socket.request.session.userId;
    // // if (!userId) {
    // //     return socket.disconnect(); // this is done twice, shouldn't be needed
    // // }

    const { rows } = await db.getChatMessages();
    //console.log("messages", rows);
    socket.emit("chatMessages", rows.reverse());

    socket.on("chatMessage", async (data) => {
        //console.log("chat message data, userID, rows", data, userId, rows);
        await db.addChatMessage(data, userId);
        const newMessage = await db.getChatMessage();
        //console.log("newmessage", newMessage);
        //console.log("newmessage rows", newMessage.rows);
        io.emit("chatMessage", newMessage.rows[0]);
    });

    //io.emit('chatMessage') //to all connected clients
    // right so userId is the active user, we need their pic and name to go with the message
    // but we also need all that info for all the other messages...
    //});
    ///socket.on("chatMessages", async () => {
    //console.log("are we getting to socket?");

    ///});
    // io to everyone, socket to one
    //1: chatMessages event must be emitted, 10 most recent messages
    //2: chatMessage event handler
    // db query to get chats
    // join to get deets and chats gother - done for initial pull
    // emit to the front end socket.emit - sends only to the person who just connected

    // send the message to eveybody...
    // can't get the userId from the session because there's no session
    // socket has params = the handshake, the node request object
    // need to use the cookie session middleware to verify the cookie in
    // the socket params
    //});
});

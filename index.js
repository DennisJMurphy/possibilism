const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db"); // adding .js is optional
const ses = require("./ses");
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: `There is no need for alarm.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
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
// const csurf = require("csurf");
// app.use(csurf());
// app.use(function (req, res, next) {
//     res.cookie("mytoken", req.csrfToken());
//     next();
// });
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
                        .then((result) => {
                            ses.sendEmail(email, code, "Password Reset")
                                .then((result) => {
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
        console.log("the things", email, input, password);
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

// get * must be the last route
// it ensures that the app will be running regardless of the url
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
    console.log("I'm listening.");
});

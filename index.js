const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db"); // adding .js is optional
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
const csurf = require("csurf");
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
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

////// end of initial setup and middleware/////

app.get("/", function (req, res) {
    //     console.log("is it true?", req.session.userId);
    //     if (!req.session.userId) {
    //         res.redirect("/welcome");
    //     } else {
    res.sendFile(__dirname + "/index.html");
    //     }
});

app.get("/welcome", function (req, res) {
    console.log("cookie present?", req.session.userId);
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.post("/login", (req, res) => {
    console.log("credentials", req.body.rows);
    var passEntered = req.body.password;
    db.getPass(req.body.email).then((result) => {
        console.log("result", result.fields);
        var tempId = result.rows[0].id;
        var passStored = result.rows[0].password;
        compare(passEntered, passStored)
            .then((result) => {
                if (result == true) {
                    req.session.userId = tempId;
                    console.log("password correct!");
                    res.json({ success: true });
                    res.sendFile(__dirname + "/index.html");
                } else {
                    console.log("password incorrect!");
                    res.json({ success: false });
                    res.sendFile(__dirname + "/index.html");
                }
            })
            .catch((err) => {
                console.log("err in post /login", err);
                res.json({ success: false });
                res.sendFile(__dirname + "/index.html");
            });
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
                    res.sendFile(__dirname + "/index.html");
                })
                .catch((err) => {
                    res.json({ success: false });
                    console.log("1err in post /add", err);
                    res.sendFile(__dirname + "/index.html");
                    return;
                });
        })
        .catch((err) => {
            res.json({ success: false });
            console.log("2err in post /add", err);
            res.sendFile(__dirname + "/index.html");
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

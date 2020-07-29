const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db"); // adding .js is optional
const cookieSession = require("cookie-session");
//const csurf = require("csurf");
const { hash, compare } = require("./bc");
app.use(express.static("public"));
app.use(express.json());
//const s3 = require("./s3");
//const { s3Url } = require("./config");
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
app.use(
    cookieSession({
        secret: `There is no need for alarm.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// app.use(csurf());

// app.use(function (req, res, next) {
//     res.setHeader("x-frame-options", "deny");
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

////// end of initial setup/////

app.get("/", function (req, res) {
    //     console.log("is it true?", req.session.userId);
    //     if (!req.session.userId) {
    //         res.redirect("/welcome");
    //     } else {
    res.sendFile(__dirname + "/index.html");
    //     }
});

app.get("/welcome", function (req, res) {
    // if (req.session.userId) {
    //     res.redirect("/");
    // } else {
    res.sendFile(__dirname + "/index.html");
    // }
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
                    req.session.userId = result.rows[0].id; // cookie = session.xxxx, should be userId
                    res.redirect("/");
                })
                .catch((err) => {
                    console.log("1err in post /add", err);
                    return;
                });
        })
        .catch((err) => {
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

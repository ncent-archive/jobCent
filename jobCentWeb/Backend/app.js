const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const cookieParser = require("cookie-parser");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "session_token",
    secret: "somesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  // req.session.user = { username: "hello" };
  // console.log("###session token: " + req.cookies.session_token);
    
    if (req.cookies.session_token && !req.session.user) {
        res.clearCookie('session_token');
    }
    next();
});

// middleware function to check for logged-in users
// var sessionChecker = (req, res, next) => {
//     if (req.session.user && req.cookies.session_token) {
//         res.redirect('/dashboard');
//     } else {
//         next();
//     }
// };

// route for Home-Page
// app.get("/login", sessionChecker, (req, res) => {
//   res.redirect("/login");
// });


require("./server/routes")(app);

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the jobCent server."
  })
);

module.exports = app;

const path = require("path");

// third-party packages
const bodyParser = require("body-parser");
const csrf = require("csurf");
const express = require("express");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoSession = require("connect-mongodb-session")(session);

// constants
const MONGODB_URL = "mongodb://localhost:27017/shop";
const SESSION_STORE = new MongoSession({
    uri: MONGODB_URL,
    collection: "sessions",
});

// routes
const adminData = require("./routes/admin");
const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");

// controllers
const errorController = require("./controllers/error");

// models
const User = require("./models/user");

const app = express();

const csrfProtection = csrf();

// engines
app.set("view engine", "pug");
app.set("views", "views");

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "9$yJAd)Gw%2!rUhHh$!SIXDmbAc@GdG287qd9gdKf@q*JLP)qQ",
        resave: false,
        saveUninitialized: false,
        store: SESSION_STORE,
    })
);

// csrf protection
app.use(csrfProtection);
// flash session
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use((req, res, next) => {
    res.locals.is_authenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// database connection
mongoose
    .connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));

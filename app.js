const path = require("path");

// third-party packages
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

// routes
const adminData = require("./routes/admin");
const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");

// controllers
const errorController = require("./controllers/error");

// models
const User = require("./models/user");

const app = express();

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
    })
);

app.use((req, res, next) => {
    User.findById("5e7bc98eec491e78d24e6ae3")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// database connection
mongoose
    .connect("mongodb://localhost:27017/shop", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        User.findOne().then((user) => {
            if (!user) {
                user = new User({
                    name: "test",
                    email: "test@test.com",
                    cart: { items: [] },
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch((err) => console.log(err));

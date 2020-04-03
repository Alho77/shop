const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5e7bc98eec491e78d24e6ae3")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
    .connect("mongodb://localhost:27017/shop", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                user = new User({
                    name: "test",
                    email: "test@test.com",
                    cart: { items: [] }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => console.log(err));

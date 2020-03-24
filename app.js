const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database").mongoConnect;
const User = require("./models/user");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5e70003cc020221a238f5d26")
        .then(user => {
            req.user = new User(user.username, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});

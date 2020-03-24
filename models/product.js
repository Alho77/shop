const mongodb = require("mongodb");

const getDb = require("../utils/database").getDb;

const ObjectId = mongodb.ObjectId;

class Product {
    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOperator;
        if (this._id) {
            // Update product
            dbOperator = db
                .collection("products")
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOperator = db.collection("products").insertOne(this);
        }
        return dbOperator.then().catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection("products")
            .find()
            .toArray()
            .then(product => {
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db
            .collection("products")
            .find({ _id: new ObjectId(prodId) })
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err));
    }

    static deleteById(prodId) {
        const db = getDb();
        return db
            .collection("products")
            .deleteOne({ _id: new ObjectId(prodId) })
            .then(() => {
                db.collection("users")
                    .findOne({ "cart.items.productId": new ObjectId(prodId) })
                    .then(user => {
                        const updatedItems = user.cart.items.filter(item => {
                            return (
                                item.productId.toString() !== prodId.toString()
                            );
                        });

                        return db.collection("users").updateOne(
                            {
                                "cart.items.productId": new ObjectId(prodId)
                            },
                            { $set: { "cart.items": updatedItems } }
                        );
                    });
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;

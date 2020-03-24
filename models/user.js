const mongodb = require("mongodb");

const getDb = require("../utils/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            this.cart.items[cartProductIndex].quantity = newQuantity;
        } else {
            this.cart.items.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            });
        }
        const db = getDb();
        return db
            .collection("users")
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: this.cart } }
            );
    }

    addOrder() {
        const db = getDb();
        const order = {
            userId: new ObjectId(this._id),
            items: this.cart.items
        };
        return db
            .collection("orders")
            .insertOne(order)
            .then(() => {
                this.cart = { items: [] };
                return db
                    .collection("users")
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    );
            });
    }

    deleteCartItem(prodId) {
        const updatedItems = this.cart.items.filter(item => {
            return item.productId.toString() !== prodId.toString();
        });
        return getDb()
            .collection("users")
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedItems } } }
            );
    }

    async fetchProducts(Object) {
        const db = getDb();
        const productIds = Object.items.map(item => {
            return item.productId;
        });

        return db
            .collection("products")
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: Object.items.find(i => {
                            return (
                                i.productId.toString() ===
                                product._id.toString()
                            );
                        }).quantity
                    };
                });
            });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection("users").findOne({ _id: new ObjectId(userId) });
    }

    getCart() {
        return this.fetchProducts(this.cart);
    }

    getOrder() {
        const db = getDb();
        return db
            .collection("orders")
            .find({ userId: new ObjectId(this._id) })
            .toArray()
            .then(async orders => {
                const updatedOrders = [];
                for (const order of orders) {
                    const items = await this.fetchProducts(order);
                    updatedOrders.push({
                        _id: new ObjectId(order._id),
                        items: items
                    });
                }
                return updatedOrders;
            });
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this);
    }
}

module.exports = User;

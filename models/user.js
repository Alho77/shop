const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.product.toString() === product._id.toString();
    });
    let newQuantity = 1;
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        this.cart.items[cartProductIndex].quantity = newQuantity;
    } else {
        this.cart.items.push({
            product: product._id,
            quantity: newQuantity
        });
    }
    return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
    const updatedItems = this.cart.items.filter(item => {
        return item.product.toString() !== productId.toString();
    });
    this.cart.items = updatedItems;
    return this.save();
};

module.exports = mongoose.model("User", userSchema);

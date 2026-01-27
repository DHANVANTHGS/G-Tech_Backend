const Cart = require('../model/Cart');
const expressAsyncHandler = require('express-async-handler');

const getCart = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    let cart = await Cart.findOne({ user: user._id }).populate('items.product');
    if (!cart) {
        cart = await Cart.create({ user: user._id, items: [] });
    }
    return res.status(200).json(cart);
});

const addToCart = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
        cart = await Cart.create({ user: user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
    } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    return res.status(200).json({ cart, message: "Item added to cart" });
});

const removeFromCart = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    return res.status(200).json({ cart, message: "Item removed from cart" });
});

const updateCartItem = expressAsyncHandler(async (req, res) => {
    const user = req.user;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }
        await cart.save();
        return res.status(200).json({ cart, message: "Cart updated" });
    } else {
        return res.status(404).json({ message: "Item not found in cart" });
    }
});

module.exports = { getCart, addToCart, removeFromCart, updateCartItem };

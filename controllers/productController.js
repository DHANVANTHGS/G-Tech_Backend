const expressAsyncHandler = require('express-async-handler');
const Product = require('../model/Product');
const mongoose = require('mongoose');

const getproducts = expressAsyncHandler(async (req, res) => {
    const products = await Product.find();
    if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json({ products });
});

const getproduct = expressAsyncHandler(async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
});

const createProduct = expressAsyncHandler(async (req, res) => {
    const { name, price, description, category, stock, cashOnDelivery } = req.body;
    const product = new Product({
        name,
        price,
        description,
        category,
        stock,
        cashOnDelivery
    });
    await product.save();
    return res.status(201).json({ product, message: "Product created successfully" });
});

const updateProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product, message: "Product updated successfully" });
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = { getproducts, getproduct, createProduct, updateProduct, deleteProduct };
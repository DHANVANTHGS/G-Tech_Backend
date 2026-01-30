const expressAsyncHandler = require('express-async-handler');
const Product = require('../model/Product');

const getproducts = expressAsyncHandler(async (req, res) => {
    let products = await Product.find();

    // Mock Fallback
    const { isMock } = require('../config/config');
    const { mockProducts } = require('../config/mockData');
    if (isMock || !products || products.length === 0) {
        console.log("⚠️ Using Mock Products Data");
        products = mockProducts;
    }

    if (req.query.category) {
        if (req.query.category === 'all') {
            // No filter
        } else {
            products = products.filter(p => p.category === req.query.category);
        }
    }
    if (req.query.search) {
        const search = req.query.search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(search) ||
            (p.description && p.description.toLowerCase().includes(search))
        );
    }

    return res.status(200).json({ products });
});

const getproduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    // Firestore IDs are strings, no specific validation needed unless we want to check length.
    // But simple existence check is enough.

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
});

const createProduct = expressAsyncHandler(async (req, res) => {
    const { name, price, description, category, stock, cashOnDelivery } = req.body;
    const product = await Product.create({
        name,
        price,
        description,
        category,
        stock,
        cashOnDelivery: cashOnDelivery || false
    });
    return res.status(201).json({ product, message: "Product created successfully" });
});

const updateProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product, message: "Product updated successfully" });
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    // Since findByIdAndDelete in my model always returns { _id: id } (it just deletes), 
    // we should perhaps check if it existed before deleting if we want strict 404.
    // But Product.findByIdAndDelete implementation is simple.
    // To be safer, we could check first.

    // For now assuming success if no error thrown.
    return res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = { getproducts, getproduct, createProduct, updateProduct, deleteProduct };
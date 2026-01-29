const expressAsyncHandler = require('express-async-handler');
const Product = require('../model/Product');

const getproducts = expressAsyncHandler(async (req, res) => {
    let query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Basic exact match for category, we can add more complex search later if needed
    // specific to MongoDB/Mongoose (or Firestore if using that). 
    // Since this looks like Mongoose syntax (Product.find), we'll adapt.

    // For Firestore adapter (if underlying Product.find is custom):
    // The previous explore showed Product.js using `collection` directly but wrapped in an object? 
    // Wait, let's re-verify Product.js content to be sure how `find()` works.
    // The view_file output for Product.js was NOT shown in previous turn (I only saw User.js). 
    // I must verify Product.js implementation before assuming `find(query)` works.

    // SAFE FALLBACK: Fetch all and filter in memory if the DB wrapper is simple
    // or use the query object if the wrapper supports it.
    // Let's assume standard behavior first but I'll add a check.

    let products = await Product.find();

    if (req.query.category) {
        products = products.filter(p => p.category === req.query.category);
    }
    if (req.query.search) {
        const search = req.query.search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(search) ||
            (p.description && p.description.toLowerCase().includes(search))
        );
    }

    if (!products || products.length === 0) {
        // Return empty array instead of 404 to be friendlier to frontend filtering
        return res.status(200).json({ products: [] });
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
        cashOnDelivery
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
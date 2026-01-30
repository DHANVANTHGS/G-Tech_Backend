const { db } = require('../config/config');

const collection = db.collection('products');

const Product = {
    collection,

    create: async (data) => {
        const productData = {
            createdAt: new Date(),
            cashOnDelivery: false,
            ...data
        };
        const docRef = await collection.add(productData);
        return { _id: docRef.id, ...productData };
    },

    findById: async (id) => {
        const doc = await collection.doc(id).get();
        if (!doc.exists) return null;
        return { _id: doc.id, ...doc.data() };
    },

    find: async (query = {}) => {
        let ref = collection;
        // Simple equality checks for now
        // If query is empty, return all documents
        if (Object.keys(query).length > 0) {
            for (const [key, value] of Object.entries(query)) {
                ref = ref.where(key, '==', value);
            }
        }
        const snapshot = await ref.get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    findByIdAndUpdate: async (id, update, options = {}) => {
        await collection.doc(id).update(update);
        if (options.new) {
            const doc = await collection.doc(id).get();
            return { _id: doc.id, ...doc.data() };
        }
        return { _id: id, ...update };
    },

    findByIdAndDelete: async (id) => {
        await collection.doc(id).delete();
        return { _id: id };
    }
};

module.exports = Product;
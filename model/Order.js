const { db } = require('../config/config');

const collection = db.collection('orders');

const Order = {
    collection,

    create: async (data) => {
        const orderData = {
            status: 'Payment Pending',
            createdAt: new Date(),
            items: [],
            ...data
        };
        const docRef = await collection.add(orderData);
        return { _id: docRef.id, ...orderData };
    },

    findById: async (id) => {
        const doc = await collection.doc(id).get();
        if (!doc.exists) return null;
        return { _id: doc.id, ...doc.data() };
    },

    find: async (query = {}) => {
        let ref = collection;
        for (const [key, value] of Object.entries(query)) {
            ref = ref.where(key, '==', value);
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
    }
};

module.exports = Order;
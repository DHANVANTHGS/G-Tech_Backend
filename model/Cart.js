const { db } = require('../config/config');

const collection = db.collection('carts');

const Cart = {
    collection,

    findOne: async (query) => {
        let ref = collection;
        for (const [key, value] of Object.entries(query)) {
            ref = ref.where(key, '==', value);
        }
        const snapshot = await ref.limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { _id: doc.id, ...doc.data() };
    },

    create: async (data) => {
        const cartData = {
            items: [],
            ...data,
            updatedAt: new Date(),
            createdAt: new Date()
        };
        const docRef = await collection.add(cartData);
        return { _id: docRef.id, ...cartData };
    },

    findById: async (id) => {
        const doc = await collection.doc(id).get();
        if (!doc.exists) return null;
        return { _id: doc.id, ...doc.data() };
    },

    save: async (cartData) => {
        // This helper is tricky because in Mongoose .save() is on the instance. 
        // We might need to handle this differently in controller. 
        // But if we pass the object with _id, we can update it.
        if (cartData._id) {
            const { _id, ...rest } = cartData;
            await collection.doc(_id).set(rest, { merge: true }); // Merge to update
            return cartData;
        }
        return null;
    },

    findOneAndUpdate: async (query, update, options = {}) => {
        // Find first
        let ref = collection;
        for (const [key, value] of Object.entries(query)) {
            ref = ref.where(key, '==', value);
        }
        const snapshot = await ref.limit(1).get();
        let id;
        if (snapshot.empty) {
            if (options.upsert) {
                const docRef = await collection.add(update); // This might be wrong if update contains $set operators etc. 
                // We need to match mongoose behavior which is complex. 
                // Ideally controllers should be refactored to not rely on complex mongoose findOneAndUpdate.
                id = docRef.id;
            } else {
                return null;
            }
        } else {
            id = snapshot.docs[0].id;
            await collection.doc(id).update(update);
        }

        if (options.new) {
            const doc = await collection.doc(id).get();
            return { _id: doc.id, ...doc.data() };
        }
        return { _id: id };
    }
};

module.exports = Cart;

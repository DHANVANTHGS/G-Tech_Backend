const { db } = require('../config/config');

const collection = db.collection('users');

const User = {
    collection,

    create: async (data) => {
        console.log("💾 User.create called for:", data.mail);
        // Add default fields
        const userData = {
            mobileno: "NA",
            gender: "NA",
            verification_mail: false,
            role: 'user',
            address: [],
            orders: [],
            ...data
        };
        try {
            const docRef = await collection.add(userData);
            console.log("✅ Firestore write success. Doc ID:", docRef.id);
            return { _id: docRef.id, ...userData };
        } catch (error) {
            console.error("❌ Firestore write failed:", error);
            throw error;
        }
    },

    findById: async (id) => {
        const doc = await collection.doc(id).get();
        if (!doc.exists) return null;
        return { _id: doc.id, ...doc.data() };
    },

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

    findByIdAndUpdate: async (id, update, options = {}) => {
        // Firestore update does not return the new document by default, so we simulate it if needed
        await collection.doc(id).update(update);
        if (options.new) {
            const doc = await collection.doc(id).get();
            return { _id: doc.id, ...doc.data() };
        }
        return { _id: id, ...update }; // Simplified return
    }
};

module.exports = User;
const { db } = require('./config/config');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    const adminEmail = 'admin@gtech.com';
    const adminPassword = 'admin123';

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('mail', '==', adminEmail).get();

        if (!snapshot.empty) {
            console.log('Admin user already exists.');
            // Optional: Update role if it exists but is not admin
            const doc = snapshot.docs[0];
            if (doc.data().role !== 'admin' && doc.data().role !== 'super-admin') {
                console.log('Updating existing user to admin role...');
                await doc.ref.update({ role: 'admin' });
                console.log('User role updated to admin.');
            }
            process.exit(0);
        }

        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = {
            name: 'G-Tech Admin',
            mail: adminEmail,
            password: hashedPassword,
            role: 'admin',
            mobileno: "9999999999",
            gender: "NA",
            verification_mail: true,
            address: [],
            orders: [],
            createdAt: new Date().toISOString()
        };

        await usersRef.add(newAdmin);
        console.log('✅ Admin user created successfully.');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        process.exit(0);
    }
}

seedAdmin();

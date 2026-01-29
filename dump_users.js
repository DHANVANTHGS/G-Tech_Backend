const { db } = require('./config/config');

async function dumpUsers() {
    console.log("🔍 Fetching users from Firestore...");
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            console.log("⚠️ No users found in 'users' collection.");
            process.exit(0);
        }

        console.log(`✅ Found ${snapshot.size} users:`);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- ID: ${doc.id}`);
            console.log(`  Name: ${data.name}`);
            console.log(`  Mail: ${data.mail}`);
            console.log(`  Role: ${data.role}`);
            console.log('-------------------');
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
    }
    process.exit(0);
}

dumpUsers();

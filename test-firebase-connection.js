// Test script to verify Firebase connection and data retrieval
const { db } = require('./config/config');

async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase Connection...\n');

  try {
    // Test 1: Check if Firestore is accessible
    console.log('1️⃣ Testing Firestore connection...');
    const productsRef = db.collection('products');
    const productsSnapshot = await productsRef.limit(5).get();
    
    if (productsSnapshot.empty) {
      console.log('   ⚠️ Products collection is empty or doesn\'t exist');
      console.log('   💡 Add products via admin panel or seed script\n');
    } else {
      console.log(`   ✅ Found ${productsSnapshot.size} product(s) in database`);
      productsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   📦 ${data.name || 'Unnamed'} - ₹${data.price || 0}`);
      });
      console.log('');
    }

    // Test 2: Check orders
    console.log('2️⃣ Testing Orders collection...');
    const ordersRef = db.collection('orders');
    const ordersSnapshot = await ordersRef.limit(5).get();
    
    if (ordersSnapshot.empty) {
      console.log('   ℹ️ Orders collection is empty (no orders yet)\n');
    } else {
      console.log(`   ✅ Found ${ordersSnapshot.size} order(s) in database\n`);
    }

    // Test 3: Check users
    console.log('3️⃣ Testing Users collection...');
    const usersRef = db.collection('users');
    const usersSnapshot = await usersRef.limit(5).get();
    
    if (usersSnapshot.empty) {
      console.log('   ℹ️ Users collection is empty (no users registered yet)\n');
    } else {
      console.log(`   ✅ Found ${usersSnapshot.size} user(s) in database\n`);
    }

    console.log('✅ Firebase connection test completed!');
    console.log('\n💡 To add data:');
    console.log('   - Use admin panel to add products');
    console.log('   - Register users via user app');
    console.log('   - Place orders via user app');

  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('   Make sure Firebase credentials are set correctly');
  }
}

// Run the test
testFirebaseConnection();


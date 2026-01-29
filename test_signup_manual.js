const fetch = require('node-fetch');

// Polyfill fetch if node-fetch is not available environment (e.g. older node)
// Actually, user is on Node + CommonJS, so standard 'fetch' might be available in Node 18+ or needs 'node-fetch'
// I'll try standard keys, or assume fetch is available if valid node version.
// If it fails, I'll assume usage of the built-in 'http' module or similar, but let's try fetch first.
// Wait, I used 'fetch' in my previous verify script, so it should be fine if node is recent.

async function testSignup() {
    console.log("🚀 Starting Signup Test...");
    const url = 'http://localhost:5000/api/auth/register';
    const newUser = {
        name: `Test User ${Date.now()}`,
        mail: `testuser${Date.now()}@example.com`,
        password: 'password123'
    };

    console.log("📤 Sending request to:", url);
    console.log("📦 Payload:", newUser);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        console.log("📥 Response Status:", response.status);
        const data = await response.json();
        console.log("📄 Response Data:", data);

        if (response.ok) {
            console.log("✅ SUCCESS: User should be in DB.");
        } else {
            console.log("❌ FAILURE: Server returned error.");
        }
    } catch (error) {
        console.error("❌ ERROR: Connection failed.");
        console.error(error);
    }
}

testSignup();

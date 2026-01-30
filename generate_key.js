const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, 'config', 'serviceAccountKey.json');

try {
    if (!fs.existsSync(keyPath)) {
        console.error("❌ Error: 'config/serviceAccountKey.json' not found!");
        console.log("Make sure you are in the 'G-Tech_Backend' folder.");
        process.exit(1);
    }

    const keyContent = fs.readFileSync(keyPath, 'utf8');
    // Validate it's JSON
    JSON.parse(keyContent);

    const base64Key = Buffer.from(keyContent).toString('base64');

    console.log("\n✅ SUCCESS! Here is your Base64 Encoded Key:");
    console.log("=================================================");
    console.log(base64Key);
    console.log("=================================================");
    console.log("\n👉 INSTRUCTIONS:");
    console.log("1. Copy the long string above (between the lines).");
    console.log("2. Go to Render Dashboard -> Environment Variables.");
    console.log("3. Add a NEW variable called 'FIREBASE_CREDENTIALS_BASE64'.");
    console.log("4. Paste this string as the value.");
    console.log("5. Delete the old 'FIREBASE_CREDENTIALS' variable if needed.");
} catch (error) {
    console.error("❌ Failed:", error.message);
}

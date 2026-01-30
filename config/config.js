const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

  let serviceAccount;
  try {
    // Try to load from serviceAccountKey.json file (for local development)
    serviceAccount = require(serviceAccountPath);
    console.log("✅ Using serviceAccountKey.json file");
  } catch (e) {
    // If file doesn't exist, try environment variables
    if (process.env.FIREBASE_CREDENTIALS_BASE64) {
      try {
        const decoded = Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
        console.log("✅ Using FIREBASE_CREDENTIALS_BASE64 env var");
      } catch (parseError) {
        console.error("❌ Failed to parse FIREBASE_CREDENTIALS_BASE64", parseError);
      }
    } else if (process.env.FIREBASE_CREDENTIALS) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        console.log("✅ Using FIREBASE_CREDENTIALS env var");
      } catch (parseError) {
        console.error("❌ Failed to parse FIREBASE_CREDENTIALS", parseError);
      }
    } else {
      // No credentials found - will use mock mode
      console.warn("⚠️ No Firebase credentials found. Using mock mode.");
      console.warn("⚠️ Set FIREBASE_CREDENTIALS or FIREBASE_CREDENTIALS_BASE64 environment variable.");
      serviceAccount = null;
    }
  }

  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Connected (Real DB)');
  } else if (!serviceAccount) {
    console.warn('⚠️ Firebase not initialized - running in mock mode');
  }
} catch (error) {
  console.error('❌ Firebase Connection Error:', error.message);
}

const connectDB = () => {
  console.log("Firebase already initialized in config.js (or skipped)");
};

// Robust DB export
let db;
try {
  db = admin.firestore();
} catch (e) {
  console.warn("⚠️ Firestore init failed (likely no app init):", e.message);
  db = {
    collection: () => ({
      doc: () => ({ get: async () => ({ exists: false }) }),
      get: async () => ({ size: 0, docs: [], forEach: () => { } }),
      add: async () => { throw new Error("DB not connected"); },
      where: function () { return this; } // Allow chaining where()
    })
  };
}

const isMock = !admin.apps.length;

module.exports = connectDB;
module.exports.db = db;
module.exports.admin = admin;
module.exports.isMock = isMock;


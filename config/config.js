const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Firebase Project Configuration
const FIREBASE_PROJECT_ID = 'g-tech-6a7c5';

try {
  const serviceAccountPath = path.join(__dirname, '..', 'g-tech-6a7c5-firebase-adminsdk-fbsvc-4013c2b40f.json');

  let serviceAccount;
  try {
    // Try to load from serviceAccountKey.json file (for local development)
    serviceAccount = require(serviceAccountPath);
    console.log("✅ Using serviceAccountKey.json file");
    console.log(`📦 Project ID: ${serviceAccount.project_id || FIREBASE_PROJECT_ID}`);
  } catch (e) {
    // If file doesn't exist, try environment variables
    if (process.env.FIREBASE_CREDENTIALS_BASE64) {
      try {
        const decoded = Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
        console.log("✅ Using FIREBASE_CREDENTIALS_BASE64 env var");
        console.log(`📦 Project ID: ${serviceAccount.project_id || FIREBASE_PROJECT_ID}`);
      } catch (parseError) {
        console.error("❌ Failed to parse FIREBASE_CREDENTIALS_BASE64", parseError);
      }
    } else if (process.env.FIREBASE_CREDENTIALS) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        console.log("✅ Using FIREBASE_CREDENTIALS env var");
        console.log(`📦 Project ID: ${serviceAccount.project_id || FIREBASE_PROJECT_ID}`);
      } catch (parseError) {
        console.error("❌ Failed to parse FIREBASE_CREDENTIALS", parseError);
      }
    } else {
      // No credentials found - will use mock mode
      console.warn("⚠️ No Firebase credentials found. Using mock mode.");
      console.warn("⚠️ Set FIREBASE_CREDENTIALS or FIREBASE_CREDENTIALS_BASE64 environment variable.");
      console.warn(`📦 Expected Project ID: ${FIREBASE_PROJECT_ID}`);
      serviceAccount = null;
    }
  }

  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || FIREBASE_PROJECT_ID
    });
    console.log('🔥 Firebase Connected (Real DB)');
    console.log(`📦 Connected to project: ${serviceAccount.project_id || FIREBASE_PROJECT_ID}`);
  } else if (!serviceAccount) {
    console.warn('⚠️ Firebase not initialized - running in mock mode');
    console.warn(`📦 Expected Project ID: ${FIREBASE_PROJECT_ID}`);
  }
} catch (error) {
  console.error('❌ Firebase Connection Error:', error.message);
  console.error(`📦 Expected Project ID: ${FIREBASE_PROJECT_ID}`);
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


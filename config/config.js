const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Firebase Project Configuration
const FIREBASE_PROJECT_ID = 'g-tech-6a7c5';

try {
  let serviceAccount = null;

  // Priority 1: FIREBASE_CREDENTIALS_BASE64 (for CI/CD and production)
  if (process.env.FIREBASE_CREDENTIALS_BASE64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decoded);
      console.log("✅ Using FIREBASE_CREDENTIALS_BASE64 env var");
    } catch (parseError) {
      console.error("❌ Failed to parse FIREBASE_CREDENTIALS_BASE64", parseError);
    }
  }
  // Priority 2: FIREBASE_CREDENTIALS (JSON string in env)
  else if (process.env.FIREBASE_CREDENTIALS) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
      console.log("✅ Using FIREBASE_CREDENTIALS env var");
    } catch (parseError) {
      console.error("❌ Failed to parse FIREBASE_CREDENTIALS", parseError);
    }
  }
  // Priority 3: Service account JSON file (for local development)
  else {
    const serviceAccountPath = path.join(__dirname, '..', 'g-tech-6a7c5-firebase-adminsdk-fbsvc-4013c2b40f.json');
    try {
      serviceAccount = require(serviceAccountPath);
      console.log("✅ Using local service account JSON file");
    } catch (e) {
      console.warn("⚠️ No Firebase credentials found in env or local file. Using mock mode.");
      console.warn("💡 To fix: Run the migration command or set FIREBASE_CREDENTIALS env var.");
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
      where: function () { return this; }, // Allow chaining where()
      limit: function () { return this; } // Allow chaining limit()
    })
  };
}

const isMock = !admin.apps.length;

module.exports = connectDB;
module.exports.db = db;
module.exports.admin = admin;
module.exports.isMock = isMock;


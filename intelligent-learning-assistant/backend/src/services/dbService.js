const admin = require('firebase-admin');
const logger = require('../middleware/logger');
const fs = require('fs');
const path = require('path');

let db;

try {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (credentialsPath && fs.existsSync(path.resolve(__dirname, '../../', credentialsPath))) {
    // If the JSON file exists, initialize using the file
    admin.initializeApp({
      credential: admin.credential.cert(path.resolve(__dirname, '../../', credentialsPath))
    });
    db = admin.firestore();
    logger.info('Firestore initialized successfully using Service Account JSON');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    // Fallback to individual environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    db = admin.firestore();
    logger.info('Firestore initialized successfully using Environment Variables');
  } else {
    logger.warn('Firebase credentials missing. Firestore will not be available. Using mock mode.');
    // Mock DB implementation
    db = {
      collection: (name) => ({
        doc: (id) => ({
          get: async () => ({ exists: false, data: () => ({}) }),
          set: async (data) => { logger.info(`Mock DB set: ${name}/${id}`, data); return { id }; },
          update: async (data) => { logger.info(`Mock DB update: ${name}/${id}`, data); return { id }; },
        }),
        add: async (data) => { logger.info(`Mock DB add to ${name}`, data); return { id: 'mock-id' }; },
        where: () => ({ get: async () => ({ docs: [] }) }),
      }),
    };
  }
} catch (error) {
  logger.error(`Error initializing Firestore: ${error.message}`);
}

module.exports = db;

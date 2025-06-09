const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const serviceAccountPath = process.env.FIREBASE_KEY_PATH;
const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://manage-finance-db.firebaseio.com"
});

const db = admin.firestore();
module.exports = { db };

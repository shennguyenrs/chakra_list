import { Firestore } from "@google-cloud/firestore";

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.CLOUD_CREDENTIAL,
});

export default db;

// Database
import db from '../config/firestoreConf';

// Model
import { USER } from '../models';

// Get user using email from database
async function getUserByEmail(reqEmail: string) {
  try {
    const snapshot = await db
      .collection('users')
      .where('email', '==', reqEmail)
      .get();

    if (snapshot.empty) {
      return false;
    }

    let users: USER[] = [];

    snapshot.docs.forEach((doc: any) =>
      users.push({ _id: doc.id, ...(doc.data() as USER) })
    );

    return users[0];
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Get user by id from database
async function getUserById(id: string) {
  try {
    const snapshot = await db.collection('users').doc(id).get();

    if (!snapshot.exists) {
      return false;
    }

    return { _id: snapshot.id, ...(snapshot.data() as USER) };
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Update codes and token
async function updateField(id: string | undefined, content: {}) {
  try {
    const edited = await db
      .collection('users')
      .doc(id as string)
      .update(content);

    if (edited) return true;
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export default {
  getUserByEmail,
  getUserById,
  updateField,
};

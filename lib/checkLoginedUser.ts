import jwt from 'jsonwebtoken';

// Lib
import userQueries from './userQueries';

// Model
import { USER, CleanUser, JWTPAYLOAD } from '../models';

export default async function checkLoginedUser(tokenCookie: string) {
  // Double check token from cookie
  let decoded;

  // Verify cookie token
  try {
    decoded = jwt.verify(
      tokenCookie,
      process.env.COOKIE_SECRET as string
    ) as JWTPAYLOAD;
  } catch (err) {
    return null;
  }

  // Check if decodec have property email and code
  if (!decoded.hasOwnProperty('id') || !decoded.hasOwnProperty('code')) {
    return null;
  }

  // Get user from database
  const decodedId = decoded.id;
  const decodedCode = decoded.code;

  const dbUser: USER | Boolean = await userQueries.getUserById(decodedId);

  // Check if user email is exist and session code is correct
  // Return clean user
  if (dbUser && (dbUser as USER).sessionToken === decodedCode) {
    const cleanUser: CleanUser = {
      _id: (dbUser as USER)._id,
      email: (dbUser as USER).email,
    };
    return cleanUser;
  }

  // If email and session code not correct
  return null;
}

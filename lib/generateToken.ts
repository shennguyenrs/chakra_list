import jwt from 'jsonwebtoken';
import cryptRandomString from 'crypto-random-string';

// Generate token and random code as login code and session code
export default function generateToken(
  userId: string | undefined,
  secret: string,
  liveTime: string
) {
  // Create random string as login code used only once
  const randomCode = cryptRandomString({ length: 16 });

  const token = jwt.sign({ id: userId, code: randomCode }, secret, {
    expiresIn: liveTime,
  });

  return { token, randomCode };
}

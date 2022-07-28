import { NextApiRequest, NextApiResponse } from 'next';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

// Libs
import generateToken from '../../../lib/generateToken';
import generateMagicLink from '../../../lib/generateMagicLink';
import checkIpBruteForced from '../../../lib/checkBruteForced';
import checkLoginedUser from '../../../lib/checkLoginedUser';
import userQueries from '../../../lib/userQueries';
import getOwnerTasks from '../../../lib/getOwnerTasks';

// Model
import {
  USER,
  JWTPAYLOAD,
  CleanUser,
  WithoutUserTask,
  CleanTask,
} from '../../../models';

// Contants
const days = 604800000; // 7 days in milliseconds

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  // POST method: post email to generate magic link
  // send magic link if user found on database
  // else return user not found message
  const handleLogin = async () => {
    const email = req.body?.email;

    // Check is email exsist
    // then generate magic link and send it through sendgrid
    const dbUser: USER | Boolean = await userQueries.getUserByEmail(email);

    if (dbUser) {
      const { token, randomCode } = generateToken(
        (dbUser as USER)._id,
        process.env.TOKEN_SECRET as string,
        '10m' // expires in 10 mintues
      );
      const message: MailDataRequired = generateMagicLink(email, token);

      // Update login code for user in database
      const result = await userQueries.updateField((dbUser as USER)._id, {
        loginToken: randomCode,
      });

      if (result) {
        try {
          // Send magc link
          sgMail.setApiKey(process.env.EMAIL_API_KEY as string);

          await sgMail.send(message);

          return res.status(200).json({ success: 'Magic link sent' });
        } catch (err) {
          return res.status(500).json({ error: 'Magic link can not send' });
        }
      }

      return res
        .status(500)
        .json({ error: 'Can not set login token to database' });
    }

    // If the email is not exist
    return res.status(404).json({ error: 'No user found' });
  };

  // GET method:
  // - verify session token from cookie to get user and tasks
  // - verify token from magic link and set cookie with session token, check ip brute-force to prevent many request to verify magic link token
  const handleVerify = async () => {
    // Verify user
    if (req.query.auth.includes('user')) {
      const user: CleanUser | null | Boolean = await checkLoginedUser(
        req.cookies.tokenCookie
      );

      if (user) {
        // Fetch tasks of user
        const tasks: CleanTask[] | boolean = await getOwnerTasks(user?._id);

        return res.status(200).json({ user, tasks });
      } else {
        return res.status(401).json({ message: 'Not login' });
      }
    }

    // Verify magic link
    if (req.query.auth.includes('callback')) {
      // Check ip brute-force
      const ipBruteForced = await checkIpBruteForced(req, res);

      if (ipBruteForced) return;

      // If not ip brute-forced
      const token: string = req.query.token as string;

      // If token is in link
      if (token) {
        let decoded;

        // Checking verify link
        try {
          decoded = jwt.verify(
            token,
            process.env.TOKEN_SECRET as string
          ) as JWTPAYLOAD;
        } catch (err) {
          return res.status(403).json({ error: 'Link can not verify' });
        }

        // Checking valid token
        if (!decoded.hasOwnProperty('id') || !decoded.hasOwnProperty('code')) {
          return res.status(403).json({ error: 'Token invalid' });
        }

        // Re-check user and login code in token
        const decodedId = decoded.id;
        const decodedCode = decoded.code;

        const dbUser: USER | Boolean = await userQueries.getUserById(decodedId);

        if (!dbUser || (dbUser as USER).loginToken !== decodedCode) {
          return res.status(403).json({ error: 'Link has been used' });
        } else {
          // Nagivate to homepage after verify user
          // set the new logined token in cookie
          const { token, randomCode } = generateToken(
            decodedId,
            process.env.COOKIE_SECRET as string,
            '7d'
          );

          // Update random code for user on database
          const result = await userQueries.updateField(decodedId, {
            sessionToken: randomCode,
            loginToken: null,
          });

          // Response with set cookie, redirect to home
          // if update on database sucess
          if (result) {
            return res
              .status(200)
              .setHeader(
                'Set-Cookie',
                `tokenCookie=${token}; HttpOnly; Path=/; expires=${new Date(
                  Date.now() + days
                ).toUTCString()}; secure=${
                  process.env.NODE_ENV === 'production' ? true : false
                }`
              )
              .redirect('/');
          }

          // Return failed on update failed on database
          // try to login again
          return res
            .status(500)
            .json({ error: 'Failed update code on database' });
        }
      }

      return res.status(404).json({ error: 'Link invalid' });
    }
  };

  // DELETE method: remove login token in cookie
  const handleLogout = async () => {
    // Remove current session code on database
    const token = req.cookies.tokenCookie;

    const decoded = jwt.decode(token) as JWTPAYLOAD;
    const result = await userQueries.updateField(decoded.id, {
      sessionToken: null,
    });

    if (result) {
      return res
        .status(200)
        .setHeader(
          'Set-Cookie',
          `tokenCookie=; HttpOnly; Path=/; expires=${new Date(0)}; secure=false`
        )
        .json({ message: 'Logout sucessfully' });
    }

    return res.status(500).json({ error: 'Logout failed on database' });
  };

  switch (method) {
    case 'GET':
      return handleVerify();
    case 'POST':
      return handleLogin();
    case 'DELETE':
      return handleLogout();
    default:
      return res.status(405).json({ error: 'This method is not allowed' });
  }
}

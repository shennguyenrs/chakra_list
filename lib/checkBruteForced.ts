import { NextApiRequest, NextApiResponse } from 'next';

const ipBook: {
  [ip: string]:
    | {
        attempts: number;
        firstAttempt: number;
      }
    | undefined;
} = {};

// Check bruteforce ip
export default async function checkIpBruteForced(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Ensure ip is string
  if (typeof reqIp !== 'string') {
    res.status(400).json({ error: 'Invaild IP' });
    return true;
  }

  const ipInfo = ipBook[reqIp];

  // Ip check from ipBook
  if (ipInfo) {
    const { attempts, firstAttempt } = ipInfo;

    // If the attempts are more than 3
    // the first attempts is less thann 1 minutes -> Too many attemp
    if (attempts > 3) {
      if (Date.now() - firstAttempt < 60000) {
        res.status(429).json({ error: 'Too many requests' });
        return true;
      } else {
        ipBook[reqIp] = undefined;
      }
    } else {
      ipBook[reqIp] = {
        attempts: ipInfo.attempts + 1,
        firstAttempt: ipInfo.firstAttempt,
      };
    }
  } else {
    ipBook[reqIp] = {
      attempts: 1,
      firstAttempt: Date.now(),
    };
  }

  return false;
}

import { MailDataRequired } from '@sendgrid/mail';

// Generate magic link email for SendGrid
// for example, send to the same email
export default function generateMagicLink(toMail: string, token: string) {
  const magicLink =
    (process.env.NODE_ENV === 'development'
      ? process.env.BASE_URL + ':' + process.env.PORT
      : process.env.DOMAIN_URL) +
    (process.env.CALLBACK_URL as string) +
    '?token=' +
    token;

  const msg: MailDataRequired = {
    to: toMail,
    from: process.env.EMAIL_FROM as string,
    subject: 'Magic link mail',
    html: `<p>This is your magic link to login ${magicLink}</p>`,
  };

  return msg;
}

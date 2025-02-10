import nodemailer from 'nodemailer';
import { config } from './config';

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY
  }
});

export async function sendMagicLink(email: string, token: string) {
  const magicLink = `${config.BASE_URL}/auth/verify?token=${token}`;
  try{
    await transporter.sendMail({
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Your Magic Link',
        text: `Click here to sign in: ${magicLink}`,
        html: `
          <h1>Sign In to Your App</h1>
          <p>Click the button below to sign in:</p>
          <a href="${magicLink}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Sign In
          </a>
          <p>This link will expire in 15 minutes.</p>
        `
      });
  }catch(e){
    console.error('Error sending email:', e);
    return;
  }
}
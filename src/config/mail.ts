import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const NODE_MAILER_HOST = process.env.NODE_MAILER_HOST;
const NODE_MAILER_USER = process.env.NODE_MAILER_USER;
const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD;
export const NODE_MAILER_SENDER = process.env.NODE_MAILER_SENDER;

const mailConfig = nodemailer.createTransport({
  host: NODE_MAILER_HOST,
  secure: false, // true for 465, false for other ports (use STARTTLS)
  requireTLS: true,
  auth: {
    user: NODE_MAILER_USER,
    pass: NODE_MAILER_PASSWORD,
  },
});

export default mailConfig;

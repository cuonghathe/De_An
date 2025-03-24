import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

//email Config
export const trasporter = nodemailer.createTransport({
  service: "email",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

export default trasporter;
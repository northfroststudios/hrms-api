import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.USER_PASS,
    pass: process.env.PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: process.env.USER_PASSWORD,
    to,
    subject,
    text,
  });
};
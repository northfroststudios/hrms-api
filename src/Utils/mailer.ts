import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'maameyaahenewaa2001@gmail.com',
    pass: 'rqpa lbzp hyix ocsm',
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: 'maameyaahenewaa2001@gmail.com',
    to,
    subject,
    text,
  });
};
import nodemailer from 'nodemailer';
import 'dotenv/config';
// Create a transporter object for sending email
const sendMail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOption = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOption);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('error sending email:', error);
    throw new Error('Error sending email');
  }
};

export default sendMail;

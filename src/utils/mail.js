import nodemailer from 'nodemailer';

// Create a transporter object for sending email
const sendMail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    port: 587,
    auth: {
      user: 'shopease.team@gmail.com',
      pass: 'ftqcdnwonericykt',
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

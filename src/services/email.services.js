require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger by Ziya Sheikh" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegisterationEmail(userEmail, name) {
    const subject = 'Welcome to Our Service!';
    const text = `Hi ${name},\n\nThank you for registering with our service! We're excited to have you on board.\n\nBest regards,\nThe Team`;
    const html = `<p>Hi ${name},</p><p>Thank you for registering with our service! We're excited to have you on board.</p><p>Best regards,<br>The Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount,toAccount, fromAccount) {
  const subject = 'Transaction Successful!';
  const text = `Hi ${name},\n\nYour transaction of $${amount} from account ${fromAccount} to account ${toAccount} was successful!\n\nBest regards,\nThe Team`;
  const html = `<p>Hi ${name},</p><p>Your transaction of $${amount} from account ${fromAccount} to account ${toAccount} was successful!</p><p>Best regards,<br>The Team</p>`;

  await sendEmail(userEmail, subject, text, html);
  
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {

  const subject = 'Transaction Failed!';
  const text = `Hi ${name},\n\nUnfortunately, your transaction of $${amount} from account ${fromAccount} to account ${toAccount} has failed. Please check your account balance and try again.\n\nBest regards,\nThe Team`;
  const html = `<p>Hi ${name},</p><p>Unfortunately, your transaction of $${amount} from account ${fromAccount} to account ${toAccount} has failed. Please check your account balance and try again.</p><p>Best regards,<br>The Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegisterationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};
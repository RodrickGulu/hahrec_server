process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ignore self-signed certificate errors
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Use middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

const EMAIL_USER = 'rodrickgulu13@gmail.com';
const EMAIL_PASSWORD = 'fryl jdkv ijsr zomu';

// Replace these values with your email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Function to send mail based on form type
const sendMail = async (formType, data) => {
  const { name, email, message, genre } = data;
  const recipientEmail = 'hitafterhit004@gmail.com'; // Replace with the recipient's email

  if (!recipientEmail) {
    throw new Error('Recipient email not specified.');
  }

  let subject = '';
  let text = '';

  switch (formType) {
    case 'musicForm':
      subject = 'New Music Booking Submission';
      text = `Name: ${name}\nEmail/Phone: ${email}\nGenre: ${genre}\nMessage: ${message}`;
      break;
    case 'videoForm':
      subject = 'New Video Booking Submission';
      text = `Name: ${name}\nEmail/Phone: ${email}\nMessage: ${message}`;
      break;
    case 'beatForm':
      subject = 'New Beat Booking Submission';
      text = `Name: ${name}\nEmail/Phone: ${email}\nMessage: ${message}`;
      break;
    default:
      throw new Error('Invalid formType');
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: recipientEmail,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking (${formType}) submitted successfully!`);
  } catch (error) {
    console.error(`Error submitting booking (${formType}):`, error);
    throw new Error('Internal Server Error');
  }
};

// POST endpoint for handling form submissions
app.post('/api/book-sesh-music', async (req, res) => {
  try {
    await sendMail('musicForm', req.body);
    res.status(200).json({ message: 'Music booking submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/api/book-sesh-video', async (req, res) => {
  try {
    await sendMail('videoForm', req.body);
    res.status(200).json({ message: 'Video booking submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/api/book-sesh-beat', async (req, res) => {
  try {
    await sendMail('beatForm', req.body);
    res.status(200).json({ message: 'Beat booking submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

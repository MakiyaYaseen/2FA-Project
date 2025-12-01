const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const moment = require('moment');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Temporary database
const users = [];
const otpStore = {}; // Format: { email: { otp: string, timestamp: Date } }

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user (in real app, store in a DB)
    users.push({ name, email, password: hashedPassword });
    
    res.json({
      success: true,
      message: 'Registration successful',
      user: { name, email }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP with timestamp (expiration is set to 5 minutes)
    otpStore[email] = { otp, timestamp: moment() };

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `<div>
        <h3>Your OTP Code</h3>
        <p>Use this code to verify your account:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
      </div>`
    });

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('OTP sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const otpData = otpStore[email];

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: 'OTP not found for this email'
      });
    }

    // Check if OTP has expired (5 minutes validity)
    const otpAge = moment().diff(otpData.timestamp, 'minutes');
    if (otpAge > 5) {
      delete otpStore[email]; // Remove expired OTP
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP
    if (otpData.otp === otp) {
      delete otpStore[email]; // Remove OTP after verification
      return res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid OTP'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed'
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

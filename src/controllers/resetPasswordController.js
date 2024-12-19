// controllers/resetPasswordController.js
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const PasswordResetToken = require('../models/passwordResetTokenModel');
const Influencer = require('../models/influencerModel');

// Function to send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Click the link below to reset your password:\n\n${process.env.CLIENT_URL}/reset-password?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Influencer.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 3600000; // 1 hour from now

    await PasswordResetToken.findOneAndUpdate(
      { email },
      { email, token, expiresAt },
      { upsert: true }
    );

    await sendPasswordResetEmail(email, token);

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const tokenDoc = await PasswordResetToken.findOne({ token });

    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await Influencer.findOne({ email: tokenDoc.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ token });

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

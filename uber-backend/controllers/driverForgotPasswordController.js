// controllers/driverForgotPasswordController.js
const db = require('../config/mysql');
const redis = require('../config/redis');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sendOtp = require('../utils/sendOtp'); // You need to implement this utility

// POST /driver/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ msg: 'Email or phone is required' });
    }

    const [rows] = await db.query(
      `SELECT * FROM users WHERE user_type = 'driver' AND (${email ? 'email = ?' : 'phone = ?'})`,
      [email || phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    const user = rows[0];
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpKey = `otp:driver:${user.user_id}`;

    await redis.setEx(otpKey, 600, otp); // 10 minutes expiry
    await sendOtp({ otp, email: user.email, phone: user.phone });

    res.json({ msg: 'OTP sent to registered email/phone' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to process forgot password' });
  }
};

// POST /driver/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, new_password } = req.body;

    if ((!email && !phone) || !otp || !new_password) {
      return res.status(400).json({ msg: 'All fields are required: email/phone, otp, new_password' });
    }

    const [rows] = await db.query(
      `SELECT * FROM users WHERE user_type = 'driver' AND (${email ? 'email = ?' : 'phone = ?'})`,
      [email || phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    const user = rows[0];
    const otpKey = `otp:driver:${user.user_id}`;
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, user.user_id]);
    await redis.del(otpKey);

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to reset password' });
  }
};

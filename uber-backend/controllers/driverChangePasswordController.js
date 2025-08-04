// controllers/driverChangePasswordController.js
const db = require('../config/mysql');
const bcrypt = require('bcrypt');

// POST /driver/change-password (JWT Protected)
exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user_id = req.user?.user_id;

    if (!old_password || !new_password) {
      return res.status(400).json({ msg: 'Old and new password are required' });
    }

    const [rows] = await db.query('SELECT password_hash FROM users WHERE user_id = ? AND user_type = "driver"', [user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    const valid = await bcrypt.compare(old_password, rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ msg: 'Old password is incorrect' });
    }

    const hashedNew = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedNew, user_id]);

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to change password' });
  }
};

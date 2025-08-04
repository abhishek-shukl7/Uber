// controllers/adminController.js
const bcrypt = require('bcrypt');
const db = require('../config/mysql');
const redis = require('../config/redis');
const { generateToken } = require('../utils/token');

exports.register = async (req, res) => {
  const { email, password, full_name } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const [admin] = await db.query(
    'INSERT INTO super_admins (email, password_hash, full_name) VALUES (?, ?, ?)',
    [email, hashed, full_name]
  );

  res.status(201).json({ message: 'Admin created', admin_id: admin.insertId });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query('SELECT * FROM super_admins WHERE email = ?', [email]);
  const admin = rows[0];
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

  const token = generateToken({ admin_id: admin.admin_id, email: admin.email });

  // Store in Redis (token/session key)
  await redis.set(`admin_token:${admin.admin_id}`, token, { EX: 86400 }); // 1 day

  res.json({ token, expires_in: 86400 });
};

exports.logout = async (req, res) => {
  const adminId = req.admin.admin_id;
  await redis.del(`admin_token:${adminId}`);
  res.json({ message: 'Logged out successfully' });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM super_admins WHERE admin_id = ?', [id]);
  await redis.del(`admin_token:${id}`);
  res.json({ message: 'Admin deleted' });
};

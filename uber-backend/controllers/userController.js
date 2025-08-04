// userController.js – Rider (User) APIs using Firebase Auth only
const db = require('../config/mysql');
const admin = require('firebase-admin');

// ✅ Rider Registration (via Firebase)
exports.registerUser = async (req, res) => {
  try {
    const { firebase_token, name, phone, email, gender, age, has_disability, image_url, address } = req.body;

    if (!firebase_token || !name || !phone || !address) {
      return res.status(400).json({ msg: 'Missing required fields (token, name, phone, address)' });
    }

    // Verify Firebase token and get UID
    const decoded = await admin.auth().verifyIdToken(firebase_token);
    const firebase_uid = decoded.uid;

    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE phone = ? OR email = ?', [phone, email]);
    if (existing.length > 0) return res.status(409).json({ msg: 'User already exists' });

    // Insert into users table
    const [result] = await db.query(
      `INSERT INTO users (firebase_uid, name, phone, email, user_type, gender, age, has_disability, image_url)
       VALUES (?, ?, ?, ?, 'rider', ?, ?, ?, ?)`,
      [firebase_uid, name, phone, email, gender, age, has_disability || false, image_url || null]
    );
    const user_id = result.insertId;

    // Save address
    await db.query(
      `INSERT INTO user_addresses (user_id, label, address_line1, city, state, country, postal_code, is_default)
       VALUES (?, 'home', ?, ?, ?, ?, ?, true)`,
      [user_id, address.line1, address.city, address.state, address.country, address.postal_code]
    );

    res.status(201).json({ user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Registration failed' });
  }
};

// ✅ Update Rider Info
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, age, has_disability, image_url } = req.body;

    await db.query(
      `UPDATE users SET name = ?, email = ?, phone = ?, gender = ?, age = ?, has_disability = ?, image_url = ?
       WHERE user_id = ? AND user_type = 'rider'`,
      [name, email, phone, gender, age, has_disability, image_url, id]
    );

    res.json({ msg: 'User updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Update failed' });
  }
};

// ✅ Delete Rider
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE user_id = ? AND user_type = "rider"', [id]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Delete failed' });
  }
};

// ✅ Get Rider by ID/Phone/Email
exports.getUser = async (req, res) => {
  try {
    const { id, phone, email } = req.query;
    let query = 'SELECT * FROM users WHERE user_type = "rider"';
    const values = [];

    if (id) { query += ' AND user_id = ?'; values.push(id); }
    if (phone) { query += ' AND phone = ?'; values.push(phone); }
    if (email) { query += ' AND email = ?'; values.push(email); }

    const [rows] = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Fetch failed' });
  }
};
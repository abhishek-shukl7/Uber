// controllers/driverController.js
const db = require('../config/mysql');
const redis = require('../config/redis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// ✅ Register Driver
exports.registerDriver = async (req, res) => {
  try {
    const { name, phone, email, password, license_number, vehicle, address } = req.body;

    if (!name || !phone || !password || !license_number || !vehicle || !vehicle.registration || !address) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [userRes] = await db.query(
      `INSERT INTO users (name, phone, email, password_hash, user_type)
       VALUES (?, ?, ?, ?, 'driver')`,
      [name, phone, email, hashedPassword]
    );
    const user_id = userRes.insertId;

    // Insert vehicle
    const [vehicleRes] = await db.query(
      `INSERT INTO vehicles (make, model, year, color, plate_number, capacity, vehicle_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [vehicle.make, vehicle.model, vehicle.year, vehicle.color, vehicle.registration, vehicle.capacity, vehicle.type]
    );
    const vehicle_id = vehicleRes.insertId;

    // Insert driver
    const [driverRes] = await db.query(
      `INSERT INTO drivers (user_id, license_number, vehicle_id)
       VALUES (?, ?, ?)`,
      [user_id, license_number, vehicle_id]
    );

    // Insert address
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

// ✅ Login Driver
exports.loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE phone = ? AND user_type = "driver"', [phone]);
    if (users.length === 0) return res.status(404).json({ msg: 'Driver not found' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const accessToken = generateToken({ user_id: user.user_id, user_type: 'driver' }, '7d');
    const refreshToken = generateToken({ user_id: user.user_id, user_type: 'driver' }, '30d');
    const token_id = uuidv4();

    await redis.set(`driver_token:${user.user_id}`, accessToken, { EX: 7 * 24 * 60 * 60 });

    await db.query(
      `INSERT INTO auth_tokens (token_id, user_id, access_token, refresh_token, user_agent, ip_address, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [token_id, user.user_id, accessToken, refreshToken, req.headers['user-agent'] || '', req.ip]
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Login failed' });
  }
};

// ✅ Logout Driver
exports.logoutDriver = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(403);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await redis.del(`driver_token:${decoded.user_id}`);
    await db.query('UPDATE auth_tokens SET revoked = true WHERE user_id = ? AND access_token = ?', [decoded.user_id, token]);

    res.json({ msg: 'Logged out' });
  } catch {
    res.sendStatus(403);
  }
};

// ✅ Update Driver
exports.updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, license_number } = req.body;
    await db.query(
      `UPDATE users u
       JOIN drivers d ON u.user_id = d.user_id
       SET u.name = ?, u.phone = ?, u.email = ?, d.license_number = ?
       WHERE d.driver_id = ?`,
      [name, phone, email, license_number, id]
    );
    res.json({ msg: 'Driver updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Update failed' });
  }
};

// ✅ Get Driver By ID
exports.getDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT u.*, d.license_number, d.rating, d.is_available, v.*
       FROM users u
       JOIN drivers d ON u.user_id = d.user_id
       JOIN vehicles v ON d.vehicle_id = v.vehicle_id
       WHERE d.driver_id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Driver not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Fetch failed' });
  }
};

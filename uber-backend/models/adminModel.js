const db = require('../config/mysql');

const getAdminByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM super_admins WHERE email = ?', [email]);
  return rows[0];
};

const createAdmin = async (admin) => {
  const { email, password_hash, full_name } = admin;
  const [result] = await db.query(
    'INSERT INTO super_admins (email, password_hash, full_name) VALUES (?, ?, ?)',
    [email, password_hash, full_name]
  );
  return result.insertId;
};

module.exports = {
  getAdminByEmail,
  createAdmin,
};

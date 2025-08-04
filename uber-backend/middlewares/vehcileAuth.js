// middleware/vehcileAuth.js
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cached = await redis.get(`driver_token:${decoded.user_id}`);

    if (!cached || cached !== token) {
      return res.status(403).json({ msg: 'Token expired or invalid' });
    }

    // Only allow driver or super_admin access
    if (decoded.user_type !== 'driver' && decoded.user_type !== 'super_admin') {
      return res.status(403).json({ msg: 'Unauthorized user role' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Auth Error:', err);
    res.status(403).json({ msg: 'Unauthorized access' });
  }
};

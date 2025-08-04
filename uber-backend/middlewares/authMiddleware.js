// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

const verifyToken = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const tokenKey =
        decoded.user_type === 'super_admin'
          ? `admin_token:${decoded.admin_id}`
          : `driver_token:${decoded.user_id}`;

      const cachedToken = await redis.get(tokenKey);
      if (!cachedToken || cachedToken !== token) {
        return res.status(403).json({ message: 'Session expired or invalid' });
      }

      // Authorization check
      if (allowedRoles.length && !allowedRoles.includes(decoded.user_type)) {
        return res.status(403).json({ message: 'Unauthorized role' });
      }

      // Attach to request
      if (decoded.user_type === 'super_admin') {
        req.admin = decoded;
      } else {
        req.user = decoded;
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = { verifyToken };

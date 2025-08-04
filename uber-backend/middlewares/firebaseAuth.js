// middleware/firebaseAuth.js
const admin = require('../config/firebase');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Missing or invalid authorization header' });
  }

  const idToken = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Firebase Auth Error:', err);
    return res.status(403).json({ msg: 'Unauthorized access' });
  }
};

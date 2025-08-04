// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/logout', verifyToken, adminController.logout);
router.delete('/:id', verifyToken, adminController.delete);

module.exports = router;

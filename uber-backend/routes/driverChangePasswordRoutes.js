// routes/driverChangePasswordRoutes.js
const express = require('express');
const router = express.Router();
const driverChangePasswordController = require('../controllers/driverChangePasswordController');
const jwtAuth = require('../middlewares/authToken');

// Change Password (JWT required)
router.post('/change-password', jwtAuth, driverChangePasswordController.changePassword);

module.exports = router;

// routes/driverPasswordRoutes.js
const express = require('express');
const router = express.Router();
const driverPasswordController = require('../controllers/driverForgotPasswordController');

// Forgot + Reset Password (via OTP)
router.post('/forgot-password', driverPasswordController.forgotPassword);
router.post('/reset-password', driverPasswordController.resetPassword);

module.exports = router;

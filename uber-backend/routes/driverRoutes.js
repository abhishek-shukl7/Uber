// routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/register', driverController.registerDriver);
router.post('/login', driverController.loginDriver);
router.post('/logout', verifyToken, driverController.logoutDriver);
router.put('/:id', verifyToken, driverController.updateDriver);
router.get('/:id', verifyToken, driverController.getDriver);

module.exports = router;

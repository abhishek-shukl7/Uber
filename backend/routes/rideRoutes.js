const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/rideController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/getFare',
    authMiddleware.checkUser,
    query('pickup').isString().isLength({min : 3}).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({min : 3}).withMessage('Invalid destination address'),
    rideController.getFare
);

router.post('/createRide',
    authMiddleware.checkUser,
    body('pickup').isString().isLength({min : 3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min : 3}).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['car','auto','moto']).withMessage('Invalid vehicle type.'),
    rideController.createRide
);

router.post('/confirm',
    authMiddleware.checkDriver,
    body('rideId').isMongoId().withMessage('Invalid ride Id.'),
    rideController.confirmRide
);

router.post('/startRide',
    authMiddleware.checkDriver,
    query('rideId').isMongoId().withMessage('Invalid ride Id.'),
    query('otp').isString().isLength({min : 6, max: 6}).withMessage('Invalid OTP'),
    rideController.startRide
);

router.post('/endRide',
    authMiddleware.checkDriver,
    body('rideId').isMongoId().withMessage('Invalid ride Id.'),
    rideController.endRide
);

module.exports = router;
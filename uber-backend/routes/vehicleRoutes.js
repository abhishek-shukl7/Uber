// routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const jwtAuth = require('../middlewares/vehcileAuth');

// Vehicle APIs (only for drivers and super_admins)
router.post('/add', jwtAuth, vehicleController.addVehicle);
router.put('/update/:id', jwtAuth, vehicleController.updateVehicle);
router.delete('/delete/:id', jwtAuth, vehicleController.deleteVehicle);

module.exports = router;

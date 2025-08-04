// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const firebaseAuthMiddleware = require('../middleware/firebaseAuth');

// Protected routes (require Firebase token)
router.post('/register', userController.registerUser);
router.put('/:id', firebaseAuthMiddleware, userController.updateUser);
router.delete('/:id', firebaseAuthMiddleware, userController.deleteUser);
router.get('/', firebaseAuthMiddleware, userController.getUser);

module.exports = router;
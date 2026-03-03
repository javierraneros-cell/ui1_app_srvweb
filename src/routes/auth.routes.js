const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/registro', asyncHandler(authController.registro));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', authController.logout);
router.get('/me', asyncHandler(authController.me));

module.exports = router;

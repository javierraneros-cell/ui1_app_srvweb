const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const authController = require('../controllers/auth.controller');
const { requireBody, validateEmailField, validatePasswordField } = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/registro',
  requireBody(['nombre', 'email', 'password']),
  validateEmailField('email'),
  validatePasswordField('password', { minLength: 6, required: true }),
  asyncHandler(authController.registro)
);
router.post(
  '/login',
  requireBody(['email', 'password']),
  validateEmailField('email'),
  validatePasswordField('password', { minLength: 6, required: true }),
  asyncHandler(authController.login)
);
router.post('/logout', authController.logout);
router.get('/me', asyncHandler(authController.me));

module.exports = router;

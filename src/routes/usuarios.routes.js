const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const usuarioController = require('../controllers/usuarios.controller');
const { requireRole } = require('../middlewares/auth');
const {
  validateObjectIdParam,
  requireBody,
  validateEmailField,
  validatePasswordField
} = require('../middlewares/validate');

const router = express.Router();

router.use(requireRole(['admin']));

router.get('/', asyncHandler(usuarioController.getListadoUsuarios));
router.get('/:id', validateObjectIdParam('id'), asyncHandler(usuarioController.getUsuario));
router.post(
  '/',
  requireBody(['nombre', 'email', 'password']),
  validateEmailField('email'),
  validatePasswordField('password', { minLength: 6, required: true }),
  asyncHandler(usuarioController.crearUsuario)
);
router.put(
  '/:id',
  validateObjectIdParam('id'),
  validateEmailField('email'),
  validatePasswordField('password', { minLength: 6 }),
  asyncHandler(usuarioController.actualizarUsuario)
);
router.delete('/:id', validateObjectIdParam('id'), asyncHandler(usuarioController.borrarUsuario));

module.exports = router;

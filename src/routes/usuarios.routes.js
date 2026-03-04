const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const usuarioController = require('../controllers/usuarios.controller');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();

router.use(requireRole(['admin']));

router.get('/', asyncHandler(usuarioController.getListadoUsuarios));
router.get('/:id', asyncHandler(usuarioController.getUsuario));
router.post('/', asyncHandler(usuarioController.crearUsuario));
router.put('/:id', asyncHandler(usuarioController.actualizarUsuario));
router.delete('/:id', asyncHandler(usuarioController.borrarUsuario));

module.exports = router;

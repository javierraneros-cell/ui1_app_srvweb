const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const profesorController = require('../controllers/profesores.controller');
const { requireRole } = require('../middlewares/auth');
const { validateObjectIdParam, requireBody, validateEmailField } = require('../middlewares/validate');

const router = express.Router();

router.get('/', asyncHandler(profesorController.getListadoProfesores));
router.get('/:id', validateObjectIdParam('id'), asyncHandler(profesorController.getProfesor));
router.post(
  '/',
  requireRole(['admin']),
  requireBody(['nombre', 'email', 'especialidad', 'foto']),
  validateEmailField('email'),
  asyncHandler(profesorController.crearProfesor)
);
router.put(
  '/:id',
  requireRole(['admin']),
  validateObjectIdParam('id'),
  validateEmailField('email'),
  asyncHandler(profesorController.actualizarProfesor)
);
router.delete('/:id', requireRole(['admin']), validateObjectIdParam('id'), asyncHandler(profesorController.borrarProfesor));

module.exports = router;

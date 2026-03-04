const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const profesorController = require('../controllers/profesores.controller');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/', asyncHandler(profesorController.getListadoProfesores));
router.get('/:id', asyncHandler(profesorController.getProfesor));
router.post('/', requireRole(['admin']), asyncHandler(profesorController.crearProfesor));
router.put('/:id', requireRole(['admin']), asyncHandler(profesorController.actualizarProfesor));
router.delete('/:id', requireRole(['admin']), asyncHandler(profesorController.borrarProfesor));

module.exports = router;

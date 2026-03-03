const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const profesorController = require('../controllers/profesores.controller');

const router = express.Router();

router.get('/', asyncHandler(profesorController.getListadoProfesores));
router.get('/:id', asyncHandler(profesorController.getProfesor));

module.exports = router;

const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const cursoController = require('../controllers/cursos.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { validateObjectIdParam, requireBody } = require('../middlewares/validate');

const router = express.Router();

router.get('/categorias', asyncHandler(cursoController.getCategorias));
router.get('/niveles', asyncHandler(cursoController.getNiveles));
router.get('/', asyncHandler(cursoController.getListadoCursos));
router.get('/:id/comentarios', validateObjectIdParam('id'), asyncHandler(cursoController.getComentariosCurso));
router.get('/:id', validateObjectIdParam('id'), asyncHandler(cursoController.getCurso));
router.post(
  '/:id/comentarios',
  requireAuth,
  validateObjectIdParam('id'),
  requireBody(['comentario', 'puntuacion']),
  asyncHandler(cursoController.crearComentarioCurso)
);
router.post(
  '/',
  requireRole(['admin']),
  requireBody(['titulo', 'categoria', 'nivel', 'duracion', 'descripcion', 'imagen', 'profesorId']),
  asyncHandler(cursoController.crearCurso)
);
router.put('/:id', requireRole(['admin']), validateObjectIdParam('id'), asyncHandler(cursoController.actualizarCurso));
router.delete('/:id', requireRole(['admin']), validateObjectIdParam('id'), asyncHandler(cursoController.borrarCurso));

module.exports = router;

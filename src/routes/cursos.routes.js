const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const cursoController = require('../controllers/cursos.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/categorias', asyncHandler(cursoController.getCategorias));
router.get('/niveles', asyncHandler(cursoController.getNiveles));
router.get('/', asyncHandler(cursoController.getListadoCursos));
router.get('/:id/comentarios', asyncHandler(cursoController.getComentariosCurso));
router.get('/:id', asyncHandler(cursoController.getCurso));
router.post('/:id/comentarios', requireAuth, asyncHandler(cursoController.crearComentarioCurso));
router.post('/', requireRole(['admin']), asyncHandler(cursoController.crearCurso));
router.put('/:id', requireRole(['admin']), asyncHandler(cursoController.actualizarCurso));
router.delete('/:id', requireRole(['admin']), asyncHandler(cursoController.borrarCurso));

module.exports = router;

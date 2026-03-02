const express = require("express");
const router = express.Router();
const cursoController = require("../controllers/cursos.controller");

//Obtener las distintas categoriras
router.get("/categorias", cursoController.getCategorias);

//Obtener los distintos niveles
router.get("/niveles", cursoController.getNiveles);

//Listado cursos
router.get("/", cursoController.getListadoCursos);

//Detalle curso
router.get("/:id", cursoController.getCurso);

module.exports = router;
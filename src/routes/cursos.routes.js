const express = require("express");
const router = express.Router();
const cursoController = require("../controllers/cursos.controller");

//Listado cursos
router.get("/", cursoController.getListadoCursos);

//Detalle curso
router.get("/:id", cursoController.getCurso);

module.exports = router;
//TODO: Cuando este el modelo de datos quitamos el json
const cursos = require("../../data/cursos.json");

exports.getListadoCursos = (req, res) => {
  res.status(200).json(cursos);
};

exports.getCurso = (req, res) =>{
  try {
    const id = req.params.id;
    const curso = cursos.find(curso => curso.id == id);

    if(!curso){
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }
    res.status(200).json(curso);
    
  } catch (error) {
    console.error("Error cargando JSON:", error);
    res.status(400).json({ mensaje: "Error consultando detalle curso " + error });
  }
  
}
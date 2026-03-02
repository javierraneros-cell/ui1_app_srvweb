//TODO: Cuando este el modelo de datos quitamos el json
const cursos = require("../../data/cursos.json");

exports.getListadoCursos = (req, res) => {
    const { titulo = "", categoria = "" } = req.query;

    //Traemos el codigo que teniamos antes en el cliente para filtrar json:
    const tituloBuscar = titulo.toLowerCase().trim();
    const categoriaBuscar = categoria.trim();

    const cursosFiltrados = cursos.filter(curso => {
        const coincideTitulo = curso.titulo.toLowerCase().includes(tituloBuscar);

        const coincideCategoria = categoriaBuscar === ""  ? true : curso.categoria === categoriaBuscar;

        return coincideTitulo && coincideCategoria;
    });

    res.status(200).json(cursosFiltrados);
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
//TODO: Cuando este el modelo de datos quitamos el json
const cursos = require("../../data/cursos.json");

exports.getListadoCursos = (req, res) => {
    const { titulo = "", categoria = "", nivel = "" } = req.query;

    //Traemos el codigo que teniamos antes en el cliente para filtrar json:
    const tituloBuscar = titulo.toLowerCase().trim();
    const categoriaBuscar = categoria.trim();
    const nivelBuscar = nivel.trim();

    const cursosFiltrados = cursos.filter(curso => {
        const coincideTitulo = curso.titulo.toLowerCase().includes(tituloBuscar);

        const coincideCategoria = categoriaBuscar === ""  ? true : curso.categoria === categoriaBuscar;

        const coincideNivel = nivelBuscar === "" ? true : curso.nivel === nivelBuscar;

        return coincideTitulo && coincideCategoria && coincideNivel;
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
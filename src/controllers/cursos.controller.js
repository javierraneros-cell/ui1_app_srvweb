//TODO: Cuando este el modelo de datos quitamos el json
//const cursos = require("../../data/cursos.json");
const Curso = require("../models/Curso");

exports.getListadoCursos = (req, res) => {
    const { titulo = "", categoria = "", nivel = "" } = req.query;

    //Traemos el codigo que teniamos antes en el cliente para filtrar json:
    const tituloBuscar = titulo.toLowerCase().trim();
    const categoriaBuscar = categoria.trim();
    const nivelBuscar = nivel.trim();

    //Recuperamos los cursos de mongodb:
    const cursos = Curso.find();
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

    //Recuperamos los cursos de MongoDb:
    const curso = await Curso.findById(id);

    if(!curso){
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }
    res.status(200).json(curso);
    
  } catch (error) {
    console.error("Error cargando JSON:", error);
    res.status(400).json({ mensaje: "Error consultando detalle curso " + error });
  }
}

//Categoris DISTINCT
exports.getCategorias = (req, res) => {
    const categorias = [...new Set(cursos.map(curso => curso.categoria))];
    res.status(200).json(categorias);
};

//Niveles DISTINCT
exports.getNiveles = (req, res) => {
    const niveles = [...new Set(cursos.map(curso => curso.nivel))];
    res.status(200).json(niveles);
};

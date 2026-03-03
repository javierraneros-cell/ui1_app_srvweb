//TODO: Cuando este el modelo de datos quitamos el json
//const cursos = require("../../data/cursos.json");
const Curso = require("../models/Curso");

exports.getListadoCursos = async (req, res) => {
    const { titulo = "", categoria = "", nivel = "" } = req.query;

    //Traemos el codigo que teniamos antes en el cliente para filtrar json:
    const tituloBuscar = titulo.toLowerCase().trim();
    const categoriaBuscar = categoria.trim();
    const nivelBuscar = nivel.trim();

    //Recuperamos los cursos de mongodb:
    const cursos = await Curso.find();
    const cursosFiltrados = cursos.filter(curso => {
        const coincideTitulo = curso.titulo.toLowerCase().includes(tituloBuscar);

        const coincideCategoria = categoriaBuscar === ""  ? true : curso.categoria === categoriaBuscar;

        const coincideNivel = nivelBuscar === "" ? true : curso.nivel === nivelBuscar;

        return coincideTitulo && coincideCategoria && coincideNivel;
    });

    res.status(200).json(cursosFiltrados);
};

exports.getCurso = async (req, res) =>{
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
exports.getCategorias = async (req, res) => {
  try{
    const cursos = await Curso.find({}, { categoria: 1 }); // solo traemos el campo categoria
    const categorias = [...new Set(cursos.map(curso => curso.categoria))];
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo categorias", error });
  }
};

//Niveles DISTINCT
exports.getNiveles = async (req, res) => {
  try {
    const cursos = await Curso.find({}, { nivel: 1 }); // solo traemos el campo nivel
    const niveles = [...new Set(cursos.map(curso => curso.nivel))];
    res.status(200).json(niveles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo niveles", error });
  }
};

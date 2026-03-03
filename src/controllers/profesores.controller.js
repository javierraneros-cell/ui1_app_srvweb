const Profesor = require('../models/Profesor');
const Curso = require('../models/Curso');

exports.getListadoProfesores = async (_req, res) => {
  const profesores = await Profesor.find().sort({ nombre: 1 }).lean();

  const cursosPorProfesor = await Curso.aggregate([
    {
      $group: {
        _id: '$profesorId',
        numCursos: { $sum: 1 }
      }
    }
  ]);

  const contador = new Map(cursosPorProfesor.map((fila) => [String(fila._id), fila.numCursos]));

  const payload = profesores.map((profesor) => ({
    _id: profesor._id,
    nombre: profesor.nombre,
    email: profesor.email,
    especialidad: profesor.especialidad,
    foto: profesor.foto,
    numCursos: contador.get(String(profesor._id)) || 0
  }));

  res.status(200).json(payload);
};

exports.getProfesor = async (req, res) => {
  const { id } = req.params;

  const profesor = await Profesor.findById(id).lean();

  if (!profesor) {
    return res.status(404).json({ mensaje: 'Profesor no encontrado' });
  }

  const numCursos = await Curso.countDocuments({ profesorId: id });

  return res.status(200).json({
    ...profesor,
    numCursos
  });
};

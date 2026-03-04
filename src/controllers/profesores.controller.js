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

exports.crearProfesor = async (req, res) => {
  const { nombre, email, especialidad, foto } = req.body;

  if (!nombre || !email || !especialidad || !foto) {
    return res.status(400).json({ mensaje: 'nombre, email, especialidad y foto son obligatorios' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const existe = await Profesor.findOne({ email: emailNormalizado });
  if (existe) {
    return res.status(409).json({ mensaje: 'Ya existe un profesor con ese email' });
  }

  const profesor = await Profesor.create({
    nombre: String(nombre).trim(),
    email: emailNormalizado,
    especialidad: String(especialidad).trim(),
    foto: String(foto).trim()
  });

  return res.status(201).json({
    mensaje: 'Profesor creado correctamente',
    profesor
  });
};

exports.actualizarProfesor = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, especialidad, foto } = req.body;

  if (email !== undefined) {
    const emailNormalizado = String(email).trim().toLowerCase();
    const duplicado = await Profesor.findOne({ email: emailNormalizado, _id: { $ne: id } });
    if (duplicado) {
      return res.status(409).json({ mensaje: 'Ya existe un profesor con ese email' });
    }
  }

  const profesorActualizado = await Profesor.findByIdAndUpdate(
    id,
    {
      ...(nombre !== undefined ? { nombre: String(nombre).trim() } : {}),
      ...(email !== undefined ? { email: String(email).trim().toLowerCase() } : {}),
      ...(especialidad !== undefined ? { especialidad: String(especialidad).trim() } : {}),
      ...(foto !== undefined ? { foto: String(foto).trim() } : {})
    },
    { new: true, runValidators: true }
  );

  if (!profesorActualizado) {
    return res.status(404).json({ mensaje: 'Profesor no encontrado' });
  }

  return res.status(200).json({
    mensaje: 'Profesor actualizado correctamente',
    profesor: profesorActualizado
  });
};

exports.borrarProfesor = async (req, res) => {
  const { id } = req.params;

  const numCursos = await Curso.countDocuments({ profesorId: id });
  if (numCursos > 0) {
    return res.status(409).json({
      mensaje: 'No se puede eliminar: el profesor tiene cursos asignados'
    });
  }

  const profesorEliminado = await Profesor.findByIdAndDelete(id);

  if (!profesorEliminado) {
    return res.status(404).json({ mensaje: 'Profesor no encontrado' });
  }

  return res.status(200).json({ mensaje: 'Profesor eliminado correctamente' });
};

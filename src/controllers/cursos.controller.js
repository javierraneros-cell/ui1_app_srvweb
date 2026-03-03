const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');

exports.getListadoCursos = async (req, res) => {
  const { titulo = '', categoria = '', nivel = '' } = req.query;

  const filtro = {};

  if (titulo.trim()) {
    filtro.titulo = { $regex: titulo.trim(), $options: 'i' };
  }

  if (categoria.trim()) {
    filtro.categoria = categoria.trim();
  }

  if (nivel.trim()) {
    filtro.nivel = nivel.trim();
  }

  const cursos = await Curso.find(filtro)
    .sort({ createdAt: -1 })
    .populate('profesorId', 'nombre email especialidad');

  const payload = cursos.map((curso) => ({
    _id: curso._id,
    titulo: curso.titulo,
    categoria: curso.categoria,
    nivel: curso.nivel,
    duracion: curso.duracion,
    descripcion: curso.descripcion,
    imagen: curso.imagen,
    profesor: curso.profesorId?.nombre || '',
    profesorId: curso.profesorId?._id || null,
    temario: curso.temario || [],
    contenidos: curso.temario || []
  }));

  res.status(200).json(payload);
};

exports.getCurso = async (req, res) => {
  const { id } = req.params;

  const curso = await Curso.findById(id).populate('profesorId', 'nombre email especialidad foto');

  if (!curso) {
    return res.status(404).json({ mensaje: 'Curso no encontrado' });
  }

  const comentarios = await Comentario.find({ cursoId: id })
    .sort({ fecha: -1 })
    .populate('usuarioId', 'nombre email');

  return res.status(200).json({
    _id: curso._id,
    titulo: curso.titulo,
    categoria: curso.categoria,
    nivel: curso.nivel,
    duracion: curso.duracion,
    descripcion: curso.descripcion,
    imagen: curso.imagen,
    profesor: curso.profesorId?.nombre || '',
    profesorDetalle: curso.profesorId
      ? {
          _id: curso.profesorId._id,
          nombre: curso.profesorId.nombre,
          email: curso.profesorId.email,
          especialidad: curso.profesorId.especialidad,
          foto: curso.profesorId.foto
        }
      : null,
    contenidos: curso.temario || [],
    temario: curso.temario || [],
    requisitos: [],
    comentarios: comentarios.map((c) => ({
      _id: c._id,
      comentario: c.comentario,
      puntuacion: c.puntuacion,
      fecha: c.fecha,
      usuario: c.usuarioId
        ? {
            _id: c.usuarioId._id,
            nombre: c.usuarioId.nombre,
            email: c.usuarioId.email
          }
        : null
    }))
  });
};

exports.getCategorias = async (_req, res) => {
  const categorias = await Curso.distinct('categoria');
  res.status(200).json(categorias);
};

exports.getNiveles = async (_req, res) => {
  const niveles = await Curso.distinct('nivel');
  res.status(200).json(niveles);
};

exports.crearCurso = async (req, res) => {
  const { titulo, categoria, nivel, duracion, descripcion, imagen, profesorId, temario } = req.body;

  if (!titulo || !categoria || !nivel || !duracion || !descripcion || !imagen || !profesorId) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios del curso' });
  }

  const curso = await Curso.create({
    titulo: String(titulo).trim(),
    categoria: String(categoria).trim(),
    nivel: String(nivel).trim(),
    duracion: String(duracion).trim(),
    descripcion: String(descripcion).trim(),
    imagen: String(imagen).trim(),
    profesorId,
    temario: Array.isArray(temario) ? temario : []
  });

  return res.status(201).json({
    mensaje: 'Curso creado correctamente',
    curso
  });
};

exports.actualizarCurso = async (req, res) => {
  const { id } = req.params;
  const { titulo, categoria, nivel, duracion, descripcion, imagen, profesorId, temario } = req.body;

  const cursoActualizado = await Curso.findByIdAndUpdate(
    id,
    {
      ...(titulo !== undefined ? { titulo: String(titulo).trim() } : {}),
      ...(categoria !== undefined ? { categoria: String(categoria).trim() } : {}),
      ...(nivel !== undefined ? { nivel: String(nivel).trim() } : {}),
      ...(duracion !== undefined ? { duracion: String(duracion).trim() } : {}),
      ...(descripcion !== undefined ? { descripcion: String(descripcion).trim() } : {}),
      ...(imagen !== undefined ? { imagen: String(imagen).trim() } : {}),
      ...(profesorId !== undefined ? { profesorId } : {}),
      ...(temario !== undefined ? { temario: Array.isArray(temario) ? temario : [] } : {})
    },
    { new: true, runValidators: true }
  );

  if (!cursoActualizado) {
    return res.status(404).json({ mensaje: 'Curso no encontrado' });
  }

  return res.status(200).json({
    mensaje: 'Curso actualizado correctamente',
    curso: cursoActualizado
  });
};

exports.borrarCurso = async (req, res) => {
  const { id } = req.params;

  const cursoEliminado = await Curso.findByIdAndDelete(id);

  if (!cursoEliminado) {
    return res.status(404).json({ mensaje: 'Curso no encontrado' });
  }

  return res.status(200).json({ mensaje: 'Curso eliminado correctamente' });
};

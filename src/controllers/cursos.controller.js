const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');
const { sanitizePlainText } = require('../utils/sanitize');

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
    contenidos: curso.temario || [],
    requisitos: curso.requisitos || []
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
    requisitos: curso.requisitos || [],
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
  const { titulo, categoria, nivel, duracion, descripcion, imagen, profesorId, temario, requisitos } = req.body;

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
    temario: Array.isArray(temario) ? temario : [],
    requisitos: Array.isArray(requisitos) ? requisitos : []
  });

  return res.status(201).json({
    mensaje: 'Curso creado correctamente',
    curso
  });
};

exports.actualizarCurso = async (req, res) => {
  const { id } = req.params;
  const { titulo, categoria, nivel, duracion, descripcion, imagen, profesorId, temario, requisitos } = req.body;

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
      ...(temario !== undefined ? { temario: Array.isArray(temario) ? temario : [] } : {}),
      ...(requisitos !== undefined ? { requisitos: Array.isArray(requisitos) ? requisitos : [] } : {})
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

exports.crearComentarioCurso = async (req, res) => {
  const { id } = req.params;
  const { comentario, puntuacion } = req.body;

  const textoSanitizado = sanitizePlainText(comentario);
  const puntuacionNumerica = Number(puntuacion);

  if (!textoSanitizado) {
    return res.status(400).json({ mensaje: 'El comentario no puede estar vacio' });
  }

  if (textoSanitizado.length > 1000) {
    return res.status(400).json({ mensaje: 'El comentario supera el maximo de 1000 caracteres' });
  }

  if (!Number.isInteger(puntuacionNumerica) || puntuacionNumerica < 1 || puntuacionNumerica > 5) {
    return res.status(400).json({ mensaje: 'La puntuacion debe estar entre 1 y 5' });
  }

  const curso = await Curso.findById(id);
  if (!curso) {
    return res.status(404).json({ mensaje: 'Curso no encontrado' });
  }

  const comentarioCreado = await Comentario.create({
    usuarioId: req.session.usuario.id,
    cursoId: curso._id,
    comentario: textoSanitizado,
    puntuacion: puntuacionNumerica
  });

  const comentarioPopulado = await Comentario.findById(comentarioCreado._id).populate('usuarioId', 'nombre email');

  return res.status(201).json({
    mensaje: 'Comentario publicado correctamente',
    comentario: {
      _id: comentarioPopulado._id,
      comentario: comentarioPopulado.comentario,
      puntuacion: comentarioPopulado.puntuacion,
      fecha: comentarioPopulado.fecha,
      usuario: comentarioPopulado.usuarioId
        ? {
            _id: comentarioPopulado.usuarioId._id,
            nombre: comentarioPopulado.usuarioId.nombre,
            email: comentarioPopulado.usuarioId.email
          }
        : null
    }
  });
};

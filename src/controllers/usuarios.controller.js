const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

function sanitizeUsuario(usuarioDoc) {
  return {
    _id: usuarioDoc._id,
    nombre: usuarioDoc.nombre,
    email: usuarioDoc.email,
    rol: usuarioDoc.rol
  };
}

exports.getListadoUsuarios = async (_req, res) => {
  const usuarios = await Usuario.find().sort({ nombre: 1 });
  return res.status(200).json(usuarios.map(sanitizeUsuario));
};

exports.getUsuario = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  return res.status(200).json(sanitizeUsuario(usuario));
};

exports.crearUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'nombre, email y password son obligatorios' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ mensaje: 'La password debe tener al menos 6 caracteres' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const existe = await Usuario.findOne({ email: emailNormalizado });
  if (existe) {
    return res.status(409).json({ mensaje: 'El email ya esta registrado' });
  }

  const rolNormalizado = rol === 'admin' ? 'admin' : 'alumno';
  const passwordHash = await bcrypt.hash(String(password), 10);

  const usuario = await Usuario.create({
    nombre: String(nombre).trim(),
    email: emailNormalizado,
    passwordHash,
    rol: rolNormalizado
  });

  return res.status(201).json({
    mensaje: 'Usuario creado correctamente',
    usuario: sanitizeUsuario(usuario)
  });
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, password } = req.body;

  if (email !== undefined) {
    const emailNormalizado = String(email).trim().toLowerCase();
    const duplicado = await Usuario.findOne({ email: emailNormalizado, _id: { $ne: id } });
    if (duplicado) {
      return res.status(409).json({ mensaje: 'El email ya esta registrado' });
    }
  }

  if (password !== undefined && String(password).length < 6) {
    return res.status(400).json({ mensaje: 'La password debe tener al menos 6 caracteres' });
  }

  const cambios = {
    ...(nombre !== undefined ? { nombre: String(nombre).trim() } : {}),
    ...(email !== undefined ? { email: String(email).trim().toLowerCase() } : {}),
    ...(rol !== undefined ? { rol: rol === 'admin' ? 'admin' : 'alumno' } : {})
  };

  if (password !== undefined && String(password).trim()) {
    cambios.passwordHash = await bcrypt.hash(String(password), 10);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, cambios, {
    new: true,
    runValidators: true
  });

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  return res.status(200).json({
    mensaje: 'Usuario actualizado correctamente',
    usuario: sanitizeUsuario(usuario)
  });
};

exports.borrarUsuario = async (req, res) => {
  const { id } = req.params;

  if (req.session?.usuario?.id === id) {
    return res.status(409).json({ mensaje: 'No puedes eliminar tu propio usuario en sesion' });
  }

  const usuario = await Usuario.findByIdAndDelete(id);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
};

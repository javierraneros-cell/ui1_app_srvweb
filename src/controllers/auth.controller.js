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

exports.registro = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'nombre, email y password son obligatorios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ mensaje: 'La password debe tener al menos 6 caracteres' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const existe = await Usuario.findOne({ email: emailNormalizado });
  if (existe) {
    return res.status(409).json({ mensaje: 'El email ya esta registrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const solicitandoAdmin = rol === 'admin';
  const rolAsignado =
    solicitandoAdmin && req.session?.usuario?.rol === 'admin' ? 'admin' : 'alumno';

  const nuevoUsuario = await Usuario.create({
    nombre: String(nombre).trim(),
    email: emailNormalizado,
    passwordHash,
    rol: rolAsignado
  });

  req.session.usuario = {
    id: String(nuevoUsuario._id),
    rol: nuevoUsuario.rol
  };

  return res.status(201).json({
    mensaje: 'Usuario registrado correctamente',
    usuario: sanitizeUsuario(nuevoUsuario)
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'email y password son obligatorios' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const usuario = await Usuario.findOne({ email: emailNormalizado });

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales invalidas' });
  }

  const passwordOk = await bcrypt.compare(password, usuario.passwordHash);

  if (!passwordOk) {
    return res.status(401).json({ mensaje: 'Credenciales invalidas' });
  }

  req.session.usuario = {
    id: String(usuario._id),
    rol: usuario.rol
  };

  return res.status(200).json({
    mensaje: 'Login correcto',
    usuario: sanitizeUsuario(usuario)
  });
};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ mensaje: 'No se pudo cerrar la sesion' });
    }

    res.clearCookie('sid');
    return res.status(200).json({ mensaje: 'Sesion cerrada' });
  });
};

exports.me = async (req, res) => {
  if (!req.session.usuario?.id) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }

  const usuario = await Usuario.findById(req.session.usuario.id);
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Sesion no valida' });
  }

  return res.status(200).json({ usuario: sanitizeUsuario(usuario) });
};

exports.requireAuth = (req, res, next) => {
  if (!req.session || !req.session.usuario || !req.session.usuario.id) {
    return res.status(401).json({ ok: false, mensaje: 'Acceso no autorizado' });
  }

  return next();
};

exports.requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario || !req.session.usuario.id) {
      return res.status(401).json({ ok: false, mensaje: 'Acceso no autorizado' });
    }

    const rol = req.session.usuario.rol;
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ ok: false, mensaje: 'No tienes permisos para esta accion' });
    }

    return next();
  };
};

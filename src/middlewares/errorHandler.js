function notFoundHandler(req, res, _next) {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err && err.name === 'CastError') {
    return res.status(400).json({ mensaje: 'Identificador no valido' });
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ mensaje: 'Datos de entrada no validos' });
  }

  return res.status(err.statusCode || 500).json({
    mensaje: err.message || 'Error interno del servidor'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

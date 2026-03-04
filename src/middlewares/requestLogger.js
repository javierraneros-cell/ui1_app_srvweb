function requestLogger(req, res, next) {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracionMs = Date.now() - inicio;
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracionMs}ms)`);
  });

  next();
}

module.exports = requestLogger;

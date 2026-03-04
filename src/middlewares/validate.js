const mongoose = require('mongoose');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function validateObjectIdParam(paramName = 'id') {
  return (req, res, next) => {
    const value = req.params?.[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ ok: false, mensaje: 'Identificador no valido' });
    }
    return next();
  };
}

function requireBody(fields) {
  return (req, res, next) => {
    const faltan = fields.filter((field) => !String(req.body?.[field] || '').trim());
    if (faltan.length > 0) {
      return res.status(400).json({ ok: false, mensaje: `Campos obligatorios: ${faltan.join(', ')}` });
    }
    return next();
  };
}

function validateEmailField(fieldName) {
  return (req, res, next) => {
    const value = req.body?.[fieldName];
    if (value !== undefined && !isValidEmail(value)) {
      return res
        .status(400)
        .json({ ok: false, mensaje: `El campo ${fieldName} no tiene un formato valido` });
    }
    return next();
  };
}

function validatePasswordField(fieldName, { minLength = 6, required = false } = {}) {
  return (req, res, next) => {
    const value = req.body?.[fieldName];

    if (required && !String(value || '').trim()) {
      return res.status(400).json({ ok: false, mensaje: `El campo ${fieldName} es obligatorio` });
    }

    if (value !== undefined && String(value).trim() && String(value).length < minLength) {
      return res
        .status(400)
        .json({
          ok: false,
          mensaje: `El campo ${fieldName} debe tener al menos ${minLength} caracteres`
        });
    }

    return next();
  };
}

module.exports = {
  validateObjectIdParam,
  requireBody,
  validateEmailField,
  validatePasswordField
};

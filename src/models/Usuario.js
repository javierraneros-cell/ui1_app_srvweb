const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      enum: ['admin', 'alumno'],
      default: 'alumno',
      required: true
    }
  },
  {
    collection: 'usuarios'
  }
);

module.exports = mongoose.model('Usuario', usuarioSchema);

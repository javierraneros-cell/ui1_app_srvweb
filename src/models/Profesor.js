const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema(
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
    especialidad: {
      type: String,
      required: true,
      trim: true
    },
    foto: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    collection: 'profesores'
  }
);

module.exports = mongoose.model('Profesor', profesorSchema);

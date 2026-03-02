const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: String,
      required: true,
      trim: true
    },
    nivel: {
      type: String,
      required: true,
      trim: true
    },
    duracion: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    imagen: {
      type: String,
      required: true,
      trim: true
    },
    profesorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profesor',
      required: true
    },
    temario: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'cursos'
  }
);

module.exports = mongoose.model('Curso', cursoSchema);

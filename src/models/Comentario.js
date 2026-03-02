const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    cursoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
      required: true
    },
    comentario: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    puntuacion: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'comentarios'
  }
);

module.exports = mongoose.model('Comentario', comentarioSchema);

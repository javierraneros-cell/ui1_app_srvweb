const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Falta la variable de entorno MONGODB_URI');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB conectado');
}

module.exports = connectDB;

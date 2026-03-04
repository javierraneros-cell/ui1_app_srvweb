const mongoose = require('mongoose');

let connectionPromise = null;

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Falta la variable de entorno MONGODB_URI');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).then((conn) => {
      console.log('MongoDB conectado');
      return conn;
    });
  }

  try {
    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

module.exports = connectDB;

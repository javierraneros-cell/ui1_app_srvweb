const app = require('../src/app');
const connectDB = require('../src/config/database');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Error iniciando handler Vercel:', error.message);
    return res.status(500).json({ ok: false, mensaje: 'Error inicializando servidor' });
  }
};

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');

const port = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error iniciando la aplicación:', error.message);
    process.exit(1);
  }
}

bootstrap();

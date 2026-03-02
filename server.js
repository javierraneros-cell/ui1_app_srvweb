const express = require("express");

//Para la lectura de el fichero .env para la conexion de la base de datos y sus credenciales
require("dotenv").config();

//Configurar Express con JSON, CORS y dotenv #34
const app = require('./src/app');

//Para servir el contenido estatico
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));  //Se añade el estatico

//Puerto del servidor NODE - Express:
const PORT = process.env.PORT || 8080;

//Conexion a la base de datos:
const connectDB = require('./src/config/database');

async function bootstrap() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`El Servidor se ejecuta en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando la aplicación:', error.message);
    process.exit(1);
  }
}
bootstrap();

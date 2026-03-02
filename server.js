const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Para la lectura de el fichero .env para la conexion de la base de datos y sus credenciales
require("dotenv").config();

//Configurar Express con JSON, CORS y dotenv #34
var app = express();
app.use(cors());
app.use(express.json());
//Para servir el contenido estatico
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));  //Se añade el estatico

// Conexión a MongoDB (Docker la inyectará)
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/ui1db")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error MongoDB:", err));

//Rutas cursos, profesores, usuarios y comentarios
const cursosRoutes = require("./src/routes/cursos.routes");
app.use("/api/cursos", cursosRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`El Servidor se ejecuta en el puerto ${PORT}`));
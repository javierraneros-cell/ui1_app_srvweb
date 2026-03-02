const express = require('express');
const cors = require("cors");

//Configurar Express con JSON, CORS y dotenv #34
const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

//Rutas cursos, profesores, usuarios y comentarios
const cursosRoutes = require("../src/routes/cursos.routes");
app.use("/api/cursos", cursosRoutes);

module.exports = app;

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require("fs");
const ejs = require("ejs");

const app = express();

// Motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //__dirname es la ruta del directorio actual (src), y "views" es la carpeta donde están las vistas EJS = /src/views

// Rutas API
const cursosRoutes = require('./routes/cursos.routes');
const profesoresRoutes = require('./routes/profesores.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const requestLogger = require('./middlewares/requestLogger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

// Middlewares
app.use(express.json());
app.use(requestLogger);
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'dev-session-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

// Archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

//Ruta check
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

// Rutas API
app.use('/api/cursos', cursosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

/******************
 * Rutas para renderizar con el motor de plantillas EJS para la página de inicio
 *****************/

//INICIO - Página de inicio lo que era antes el index.html con carrusel de imágenes y enlaces a cursos destacados
app.get("/", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "index.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");

    res.render("layout", {
        titulo: "Formación Global Online",
        pageId: "inicio",
        header: "index",   // <-- usa header con carrusel
        scripts: '<script src="js/index.js"></script>', // <-- script específico para la página de inicio
        body: ejs.render(contenido)
    });
});

//Al haber metido la ruta / al final, cualquier ruta no encontrada caerá aquí y se renderizará la página de inicio. Para evitar esto, se deben colocar las rutas específicas antes de esta ruta general.
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
